import {Component, computed, effect, signal} from '@angular/core';
import {inject} from '@angular/core';
import {FormBuilder,FormControl,ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {DataCollectionStore} from '../../../application/data-collection-store';
import {Visit} from '../../../domain/model/visit.entity';
import {TranslatePipe} from '@ngx-translate/core';
import {IamStore} from '@iam/application/iam-store';
import {ExpectedVisit} from '@diagnosis/domain/model/expected-visit.entity';
import {DiagnosisStore} from '@diagnosis/application/diagnosis-store';
import {CatalogStore} from '@catalog/application/catalog-store';

@Component({
  selector: 'app-visit-form',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './visit-form.html',
  styleUrl: './visit-form.css'
})
export class VisitForm {
  private fb=inject(FormBuilder);
  private router=inject(Router)
  private route=inject(ActivatedRoute);
  private dataCollectionStore=inject(DataCollectionStore);
  private diagnosisStore = inject(DiagnosisStore);
  private iamStore = inject(IamStore);
  private catalogStore = inject(CatalogStore);

  /**
   * Form group for visit submission
   */
  form = this.fb.group({
    failure: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    id_vehicle: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    time_visit: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    id_service: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
  });


  /**
   * List of visits
   */
  visits = this.dataCollectionStore.visits;

  /**
   * Auto repair ID from route parameters
   */
  autoRepairId = signal<string>('');

  /**
   * List of services (global)
   */
  services = this.catalogStore.services;

  /**
   * List of service offers (loaded for the selected auto repair)
   */
  serviceOffers = this.catalogStore.serviceOffers;

  /**
   * Computed signal: Filters the full service list to show only those services
   * that have an active offer from the selected auto repair shop.
   */
  servicesWithActiveOffer = computed(() => {
    const allServices = this.services();
    const offers = this.serviceOffers();

    const offeredServiceIds = new Set(offers.map(offer => offer.service_id));

    return allServices.filter(service => offeredServiceIds.has(service.id));
  });

  /**
   * Vehicles filtered by the current user
   */
  vehiclesFilteredByCurrentUser = computed(() => {
    const vehicles = this.dataCollectionStore.vehicles;
    const currentUserId = this.iamStore.sessionUserId();
    if (!currentUserId) return [];
    return vehicles().filter(vehicle => this.iamStore.isCurrentUser(vehicle.id_user));
  })


  /**
   * Initializes the component and subscribes to route parameters
   */
  constructor() {
    this.route.params.subscribe(params => {
      this.autoRepairId.set(params['id']);
    });

    effect(() => {
      const id = this.autoRepairId();
      if (id) {
        this.catalogStore.loadServiceOffers(id);
      }
    });
  }

  /**
   * Submits the visit form and adds a new visit and expected visit to the store
   */
  submit() {
    const formValue = this.form.value;
    if (this.form.invalid) return;

    const visit = new Visit({
      id_visit: `V${Date.now()}`,
      failure: formValue.failure ?? '',
      id_vehicle: formValue.id_vehicle ?? '',
      time_visit: formValue.time_visit!,
      id_auto_repair: this.autoRepairId(),
      id_service: formValue.id_service ?? '',
    });

    const expectedVisit = new ExpectedVisit({
      id_expected: `EV${Date.now()}`,
      state_visit: 'Pending Visit',
      id_visit: visit.id,
      is_scheduled: false,
    })

    this.dataCollectionStore.addVisit(visit);
    this.diagnosisStore.addExpectedVisit(expectedVisit);
    this.router.navigate(['layout-owner/data-collection/visit-alert']).then();
  }

  /**
   * Navigates back to the previous location
   */
  goBack() {
    this.router.navigate(['layout-owner/auto-repair-catalog/search-auto-repair']).then();
  }
}
