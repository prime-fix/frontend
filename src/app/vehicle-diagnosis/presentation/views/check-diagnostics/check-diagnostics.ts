import {ChangeDetectionStrategy, Component, computed, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {IamStore} from '@iam/application/iam-store';
import {DataCollectionStore} from '@collections/application/data-collection-store';
import {DiagnosisStore} from '@diagnosis/application/diagnosis-store';
import {TrackingStore} from '@tracking/application/tracking-store';
import {CatalogStore} from '@catalog/application/catalog-store';

@Component({
  selector: 'app-check-diagnostics',
  imports: [TranslatePipe],
  templateUrl: './check-diagnostics.html',
  styleUrl: './check-diagnostics.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckDiagnostics implements OnInit{
  private readonly route = inject(ActivatedRoute);
  private readonly iamStore = inject(IamStore);
  private readonly dataCollectionStore = inject(DataCollectionStore);
  private readonly diagnosisStore = inject(DiagnosisStore);
  private readonly catalogStore = inject(CatalogStore);
  private readonly trackingStore = inject(TrackingStore);

  readonly vehicleId = signal<number | null>(null);
  readonly loading = signal(false);

  currentAutoRepair = computed(() => {
    const userAccountId = this.iamStore.sessionUserAccount()?.id;
    if (!userAccountId) return undefined;
    return this.catalogStore.autoRepairs().find(ar => ar.user_account_id === userAccountId);
  });

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

  currentExpectedVisit = computed(() => {
    const visit = this.currentVisit();
    if (!visit) return null;
    return this.diagnosisStore.expectedVisits().find(ev => ev.visit_id === visit.id) || null;
  });


  currentDiagnosticsByCurrentExpectedVisitId = computed(() => {
      const expectedVisit = this.currentExpectedVisit();
      if (!expectedVisit) return [];
      return this.diagnosisStore.diagnostics().filter(d => d.vehicle_id === expectedVisit.vehicle_id);
  });

  /**
   * Get owner information for the current vehicle
   */
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        const parsedId = Number(idParam);
        if (!isNaN(parsedId)) {
          this.vehicleId.set(parsedId);
        } else {
          this.vehicleId.set(null);
        }
      } else {
        this.vehicleId.set(null);
      }
    });
  }

}
