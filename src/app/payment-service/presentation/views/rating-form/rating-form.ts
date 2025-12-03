import {Component, computed, inject} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PaymentServiceStore} from '../../../application/payment-service-store';
import {Rating} from '../../../domain/model/rating.entity';
import {TranslatePipe} from '@ngx-translate/core';
import {IamStore} from '@iam/application/iam-store';
import {DataCollectionStore} from '@collections/application/data-collection-store';
import {CatalogStore} from '@catalog/application/catalog-store';

@Component({
  selector: 'app-rating-form',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './rating-form.html',
  styleUrl: './rating-form.css'
})
export class RatingForm {
  private fb = inject(FormBuilder);
  private paymentServiceStore = inject(PaymentServiceStore);
  private dataCollectionStore = inject(DataCollectionStore);
  private catalogStore = inject(CatalogStore);
  private iamStore = inject(IamStore);
  private router = inject(Router);

  /**
   * ID of the user account from the IAM store
   */
  public userAccountId = this.iamStore.sessionUserAccountId;
  /**
   * Visits filtered by the selected vehicle ID
   */
  public visitsByVehicleId = computed(() => {
    return this.dataCollectionStore.visits().filter(v => v.vehicle_id === this.paymentServiceStore.vehicleIdFilter());
  })
  /**
   * Auto repair associated with the visits of the selected vehicle
   */
  public autoRepairByVehicle = computed(() => {
    const visits = this.visitsByVehicleId();
    if (visits.length === 0) {
      return null;
    }
    const autoRepairs = this.catalogStore.autoRepairs();
    return autoRepairs.find(ar => ar.id === visits[0].auto_repair_id) || null;
  })

  /**
   * Rating form group
   */
  form = this.fb.group({
    star_rating: new FormControl<number | null>(null, { validators: [Validators.required] }),
    comment: new FormControl<string>(''),
  });

  /**
   * Select a star rating
   * @param value - The star rating value to select
   */
  selectRating(value: number) {
    this.form.controls.star_rating.setValue(value);
  }

  /**
   * Submit the rating form
   */
  submit() {
    // Mark star_rating as touched to show validation errors
    this.form.controls.star_rating.markAsTouched();

    if (this.form.invalid) {
      return;
    }

    const newRating = new Rating({
      id: 0, // ID will be set by the backend
      star_rating: this.form.value.star_rating!,
      comment: this.form.value.comment ?? '',
      time_rating: new Date().toISOString().slice(0, 10), // Format: YYYY-MM-DD
      auto_repair_id: this.autoRepairByVehicle()?.id!,
      user_account_id: this.userAccountId()!
    });

    this.paymentServiceStore.addRating(newRating);
    this.router.navigate(['layout-owner/payment-service/rating/done']).then();
  }
}
