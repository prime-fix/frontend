import {ChangeDetectionStrategy, Component, computed, inject, OnInit, signal} from '@angular/core';
import {ProgressStep} from '@tracking/domain/interfaces/progress-step.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {IamStore} from '@iam/application/iam-store';
import {DataCollectionStore} from '@collections/application/data-collection-store';
import {RegisterStore} from '@register/application/register-store';
import {DiagnosisStore} from '@diagnosis/application/diagnosis-store';

@Component({
  selector: 'app-check-diagnostics',
  imports: [
    TranslatePipe
  ],
  templateUrl: './check-diagnostics.html',
  styleUrl: './check-diagnostics.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckDiagnostics implements OnInit{
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);
  private readonly iamStore = inject(IamStore);
  private readonly dataCollectionStore = inject(DataCollectionStore);
  private readonly registerStore = inject(RegisterStore);
  private readonly diagnosisStore = inject(DiagnosisStore);

  readonly vehicleId = signal<string | null>(null);
  readonly loading = signal(false);

  steps: ProgressStep[] = [
    { id: 1, label: 'En espera', translationKey: 'progress-bar.waiting' },
    { id: 2, label: 'En diagnóstico', translationKey: 'progress-bar.diagnosis' },
    { id: 3, label: 'En reparación', translationKey: 'progress-bar.repair' },
    { id: 4, label: 'En prueba', translationKey: 'progress-bar.testing' },
    { id: 5, label: 'Listo para recoger', translationKey: 'progress-bar.readyPickup' },
    { id: 6, label: 'Recogido', translationKey: 'progress-bar.collected' }
  ];

  currentAutoRepair = computed(() => {
    const userAccountId = this.iamStore.sessionUserAccount()?.id;
    if (!userAccountId) return undefined;
    return this.registerStore.autoRepairs().find(ar => ar.id_user_account === userAccountId);
  });

  currentVehicle = computed(() => {
    const id = this.vehicleId();
    if (!id) return null;
    return this.dataCollectionStore.vehicles().find(v => v.id === id) || null;
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
      v => v.id_vehicle === vehicle.id && v.id_auto_repair === autoRepairId
    ) || null;
  });

  currentExpectedVisit = computed(() => {
    const visit = this.currentVisit();
    if (!visit) return null;
    return this.diagnosisStore.expectedVisits().find(ev => ev.id_visit === visit.id) || null;
  });


  currentDiagnosticsByCurrentExpectedVisitId = computed(() => {
      const expectedVisit = this.currentExpectedVisit();
      if (!expectedVisit) return [];
      return this.diagnosisStore.diagnostics().filter(d => d.id_expected === expectedVisit.id);
  });

  /**
   * Get owner information for the current vehicle
   */
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.vehicleId.set(id);
    })
  }

}
