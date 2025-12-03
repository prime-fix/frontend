import {Component, computed, signal} from '@angular/core';
import {inject} from '@angular/core';
import {FormBuilder,FormControl,ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {DataCollectionStore} from '../../../application/data-collection-store';
import {Visit} from '../../../domain/model/visit.entity';
import {TranslatePipe} from '@ngx-translate/core';
import {IamStore} from '@iam/application/iam-store';
import {TrackingStore} from '@tracking/application/tracking-store';

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
  private readonly dataCollectionStore=inject(DataCollectionStore);
  private readonly iamStore = inject(IamStore);
  private readonly trackingStore = inject(TrackingStore);

  /**
   * Form group for visit submission
   */
  form = this.fb.group({
    failure: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    vehicle_id: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required] }),
    time_visit: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    service_id: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required] }),
  });


  /**
   * List of visits
   */
  visits = this.dataCollectionStore.visits;

  /**
   * Auto repair ID from route parameters
   */
  autoRepairId = signal<number>(0);

  /**
   * Vehicles filtered by the current user
   */
  vehiclesFilteredByCurrentUser = computed(() => {
    const vehicles = this.trackingStore.vehicles;
    const currentUserId = this.iamStore.sessionUserId();
    if (!currentUserId) return [];
    return vehicles().filter(vehicle => this.iamStore.isCurrentUser(vehicle.user_id));
  })

  /**
   * List of services
   */
  services = this.dataCollectionStore.services;

  /**
   * Initializes the component and subscribes to route parameters
   */
  constructor() {
    this.route.params.subscribe(params => {
      this.autoRepairId.set(params['id']);
    });
  }

  /**
   * Submits the visit form and adds a new visit and expected visit to the store
   */
  submit() {
    const formValue = this.form.value;
    if (this.form.invalid) return;

    const visit = new Visit({
      id: 0, // ID will be set by backend or store
      failure: formValue.failure ?? '',
      vehicle_id: formValue.vehicle_id ?? 0,
      time_visit: formValue.time_visit!,
      auto_repair_id: this.autoRepairId(),
      service_id: formValue.service_id ?? 0,
    });

    this.dataCollectionStore.addVisit(visit);
    this.router.navigate(['layout-owner/data-collection/visit-alert']).then();
  }

  /**
   * Navigates back to the previous location
   */
  goBack() {
    this.router.navigate(['layout-owner/auto-repair-catalog/search-auto-repair']).then();
  }
}
