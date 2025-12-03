import {ChangeDetectionStrategy, Component, inject, signal, computed, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ProgressStep} from '@tracking/domain/interfaces/progress-step.interface';
import {IamStore} from '@iam/application/iam-store';
import {DataCollectionStore} from '@collections/application/data-collection-store';
import {DiagnosisStore} from '@diagnosis/application/diagnosis-store';
import {Diagnostic} from '@diagnosis/domain/model/diagnostic.entity';
import {CatalogStore} from '@catalog/application/catalog-store';
import {TrackingStore} from '@tracking/application/tracking-store';

@Component({
  selector: 'app-modify-diagnosis',
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './modify-diagnosis.html',
  styleUrl: './modify-diagnosis.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModifyDiagnosis implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly iamStore = inject(IamStore);
  private readonly dataCollectionStore = inject(DataCollectionStore);
  private readonly diagnosisStore = inject(DiagnosisStore);
  private readonly catalogStore = inject(CatalogStore);
  private readonly trackingStore = inject(TrackingStore);

  /**
   * Signal for vehicle ID from route params
   */
  readonly vehicleId = signal<number | null>(null);
  /**
   * Loading state signal
   */
  readonly loading = signal(false);
  /**
   * Signal for new diagnostic being created
   */
  readonly newDiagnostic = signal<Diagnostic | null>(null);

  /**
   * Progress steps for vehicle repair status
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
   * Get current vehicle by ID
   */
  currentVehicle = computed(() => {
    const id = this.vehicleId();
    if (!id) return null;
    return this.trackingStore.vehicles().find(v => v.id === id) || null;
  });

  /**
   * Get visit for the current vehicle
   */
  currentVisit = computed(() => {
    const vehicle = this.currentVehicle();
    if (!vehicle) return null;

    const autoRepairId = this.currentAutoRepair()?.id;
    if (!autoRepairId) return null;

    return this.dataCollectionStore.visits().find(
      v => v.vehicle_id === vehicle.id && v.auto_repair_id === autoRepairId
    ) || null;
  });

  /**
   * Get owner information for the current vehicle
   */
  currentOwner = computed(() => {
    const vehicle = this.currentVehicle();
    if (!vehicle) return null;

    return this.iamStore.users().find(u => u.id === vehicle.user_id) || null;
  });

  /**
   * Get ExpectedVisit for the current visit
   */
  currentExpectedVisit = computed(() => {
    const visit = this.currentVisit();
    if (!visit) return null;

    return this.diagnosisStore.expectedVisits().find(ev => ev.visit_id === visit.id) || null;
  });

  /**
   * Form group for modifying diagnosis
   */
  readonly modifyForm = this.fb.group({
    diagnosis: ['', Validators.required],
    failure: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]]
  });

  /**
   * Component initialization
   */
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      const id = idParam ? Number(idParam) : null;
      this.vehicleId.set(id);

      if (id && !isNaN(id)) {
        // Wait for computed signals to update
        setTimeout(() => {
          const vehicle = this.currentVehicle();
          const visit = this.currentVisit();
          const diagnostic = this.newDiagnostic();

          if (vehicle && visit) {
            this.modifyForm.patchValue({
              failure: visit.failure || '',
              diagnosis: '',
              price: diagnostic?.price || 0
            });
          }
        }, 100);
      }
    });
  }

  /**
   * Handle form submission to modify diagnosis
   */
  onSubmit(): void {
    if (this.modifyForm.invalid) {
      this.modifyForm.markAllAsTouched();
      return;
    }

    const vehicle = this.currentVehicle();
    const visit = this.currentVisit();
    const expectedVisit = this.currentExpectedVisit();

    if (!vehicle || !visit) {
      alert(this.translate.instant('vehicle-diagnosis.no-data'));
      return;
    }

    if (!expectedVisit) {
      alert('No se encontró la visita esperada asociada');
      return;
    }

    this.loading.set(true);

    const formData = this.modifyForm.getRawValue();

    try {
      // Create new diagnostic
      const newDiagnostic = new Diagnostic({
          id: 0, // ID will be set by backend
          price: formData.price!,
          vehicle_id: vehicle.id,
          diagnosis: formData.diagnosis!,
      });

      this.diagnosisStore.addDiagnostic(newDiagnostic);


      setTimeout(() => {
        this.loading.set(false);
        alert(this.translate.instant('vehicle-diagnosis.button-update'));
        void this.router.navigate(['/layout-workshop/vehicle-diagnosis/diagnosis-view']);
      }, 500);
    } catch (error) {
      console.error('Error updating diagnosis:', error);
      this.loading.set(false);
      alert('Error al actualizar el diagnóstico');
    }
  }


  /**
   * Handle cancellation and navigate back to diagnosis view
   */
  onCancel(): void {
    void this.router.navigate(['/layout-workshop/vehicle-diagnosis/diagnosis-view']);
  }
}
