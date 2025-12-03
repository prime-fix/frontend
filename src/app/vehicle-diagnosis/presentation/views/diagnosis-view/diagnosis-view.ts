import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ProgressStep} from '@tracking/domain/interfaces/progress-step.interface';
import {IamStore} from '@iam/application/iam-store';
import {DataCollectionStore} from '@collections/application/data-collection-store';
import {Vehicle} from '@tracking/domain/model/vehicle.entity';
import {CatalogStore} from '@catalog/application/catalog-store';
import {TrackingStore} from '@tracking/application/tracking-store';

@Component({
  selector: 'app-diagnosis',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './diagnosis-view.html',
  styleUrl: './diagnosis-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiagnosisView {
  private readonly router = inject(Router);
  private readonly iamStore = inject(IamStore);
  private readonly dataCollectionStore = inject(DataCollectionStore);
  private readonly trackingStore = inject(TrackingStore);
  private readonly catalogStore = inject(CatalogStore);
  readonly translate = inject(TranslateService);

  /**
   * Signal for loading state
   */
  readonly loading = signal(false);
  /**
   * Signal for error messages
   */
  readonly error = signal<string | null>(null);

  /**
   * Signal for state modal visibility
   */
  readonly isStateModalOpen = signal(false);
  /**
   * Signal for modal loading state
   */
  readonly modalLoading = signal<boolean | null>(null);
  /**
   * Signal for selected vehicle state
   */
  readonly selectedState = signal<number | null>(null);
  /**
   * Signal for selected vehicle ID
   */
  readonly selectedVehicleId = signal<number | null>(null);

  /**
   * Progress steps for vehicle maintenance
   */
  steps: ProgressStep[] = [
    { id: 1, label: 'En espera', translationKey: 'progress-bar.waiting' },
    { id: 2, label: 'En diagnóstico', translationKey: 'progress-bar.diagnosis' },
    { id: 3, label: 'En reparación', translationKey: 'progress-bar.repair' },
    { id: 4, label: 'En prueba', translationKey: 'progress-bar.testing' },
    { id: 5, label: 'Listo para recoger', translationKey: 'progress-bar.readyPickup' },
    { id: 6, label: 'Recogido', translationKey: 'progress-bar.collected' }
  ];

  /**
   * Get the current auto repair (workshop) based on the session user account
   */
  currentAutoRepair = computed(() => {
    const userAccountId = this.iamStore.sessionUserAccount()?.id;
    if (!userAccountId) return undefined;
    return this.catalogStore.autoRepairs().find(ar => ar.user_account_id === userAccountId);
  });

  /**
   * Get visits filtered by the current auto repair
   */
  visitsByAutoRepair = computed(() => {
    const autoRepairId = this.currentAutoRepair()?.id;
    if (!autoRepairId) return [];
    return this.dataCollectionStore.visits().filter(visit => visit.auto_repair_id === autoRepairId);
  });

  /**
   * Get vehicles that have visits in the current auto repair
   */
  vehiclesByVisits = computed(() => {
    const visits = this.visitsByAutoRepair();
    if (visits.length === 0) return [];

    const vehicles = this.trackingStore.vehicles();
    const vehicleIds = new Set(visits.map(visit => visit.vehicle_id));

    return vehicles.filter(vehicle => vehicleIds.has(vehicle.id));
  });

  readonly stateOptions = computed(() => {
    return this.steps.map(s => ({
      id: s.id,
      label: this.translate.instant(s.translationKey)
    }));
  });

  /**
   * Get user (owner) information by vehicle ID
   */
  getUserByVehicleId(vehicleId: number) {
    return computed(() => {
      const vehicle = this.trackingStore.vehicles().find(v => v.id === vehicleId);
      if (!vehicle) return null;

      const user = this.iamStore.users().find(u => u.id === vehicle.user_id);
      return user || null;
    });
  }

  /**
   * Get visit by vehicle ID
   */
  getVisitByVehicleId(vehicleId: number) {
    return computed(() => {
      return this.visitsByAutoRepair().find(v => v.vehicle_id === vehicleId) || null;
    });
  }

  /**
   * Navigate to modify diagnosis page for adding a new diagnostic
   * @param vehicleId - ID of the vehicle
   */
  addDiagnostic(vehicleId: number): void {
    void this.router.navigate(['layout-workshop/vehicle-diagnosis/modify-diagnosis/edit', vehicleId]);
  }

  /**
   * Navigate to modify diagnosis page for the vehicle
   */
  updateVehicleState(): void {
    const oldVehicle = this.trackingStore.getVehicleById(this.selectedVehicleId());
    const updatedVehicle = new Vehicle({
      id: oldVehicle()?.id!,
      color: oldVehicle()?._color!,
      model: oldVehicle()?._model!,
      user_id: oldVehicle()?.user_id!,
      vehicle_brand: oldVehicle()?._vehicle_brand!,
      vehicle_plate: oldVehicle()?._vehicle_plate!,
      vehicle_type: oldVehicle()?._vehicle_type!,
      maintenance_status: this.selectedState()!
    });

    this.trackingStore.updateVehicle(updatedVehicle);
    this.closeStateModal();
  }

  /**
   * Navigate to check diagnostics page for the vehicle
   */
  checkDiagnostics(vehicleId: number): void {
    void this.router.navigate(['layout-workshop/vehicle-diagnosis/check-diagnostics', vehicleId]);
  }

  /**
   * Open state modal
   * @param vehicleId - ID of the vehicle
   * @param currentState - Current state of the vehicle
   */
  openStateModal(vehicleId: number, currentState: number): void {
    this.selectedVehicleId.set(vehicleId);
    this.selectedState.set(currentState);
    this.isStateModalOpen.set(true);
  }

  /**
   * Close state modal and reset selections
   */
  closeStateModal(): void {
    this.isStateModalOpen.set(false);
    this.selectedVehicleId.set(null);
    this.selectedState.set(null);
    this.modalLoading.set(false);
  }
}
