import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {ProgressStep} from '@tracking/domain/interfaces/progress-step.interface';
import {IamStore} from '@iam/application/iam-store';
import {RegisterStore} from '@register/application/register-store';
import {DataCollectionStore} from '@collections/application/data-collection-store';

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
  private readonly registerStore = inject(RegisterStore);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

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
    return this.registerStore.autoRepairs().find(ar => ar.id_user_account === userAccountId);
  });

  /**
   * Get visits filtered by the current auto repair
   */
  visitsByAutoRepair = computed(() => {
    const autoRepairId = this.currentAutoRepair()?.id;
    if (!autoRepairId) return [];
    return this.dataCollectionStore.visits().filter(visit => visit.id_auto_repair === autoRepairId);
  });

  /**
   * Get vehicles that have visits in the current auto repair
   */
  vehiclesByVisits = computed(() => {
    const visits = this.visitsByAutoRepair();
    if (visits.length === 0) return [];

    const vehicles = this.dataCollectionStore.vehicles();
    const vehicleIds = new Set(visits.map(visit => visit.id_vehicle));

    return vehicles.filter(vehicle => vehicleIds.has(vehicle.id));
  });

  /**
   * Get user (owner) information by vehicle ID
   */
  getUserByVehicleId(vehicleId: string) {
    return computed(() => {
      const vehicle = this.dataCollectionStore.vehicles().find(v => v.id === vehicleId);
      if (!vehicle) return null;

      const user = this.iamStore.users().find(u => u.id === vehicle.id_user);
      return user || null;
    });
  }

  /**
   * Get visit by vehicle ID
   */
  getVisitByVehicleId(vehicleId: string) {
    return computed(() => {
      return this.visitsByAutoRepair().find(v => v.id_vehicle === vehicleId) || null;
    });
  }

  /**
   * Navigate to modify diagnosis page for the vehicle
   */
  updateVehicleState(vehicleId: string): void {
    // Navigate to modify-diagnosis view with vehicle ID
    void this.router.navigate(['layout-workshop/vehicle-diagnosis/modify-diagnosis/edit', vehicleId]);
  }
}
