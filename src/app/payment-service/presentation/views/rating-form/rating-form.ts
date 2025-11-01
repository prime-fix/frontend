import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PaymentServiceStore} from '../../../application/payment-service-store';
import {Rating} from '../../../domain/model/rating.entity';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-rating-form',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './rating-form.html',
  styleUrl: './rating-form.css'
})
export class RatingForm {
  private fb = inject(FormBuilder);
  private store = inject(PaymentServiceStore);

  private router = inject(Router);

  /*
  * Usuario de prueba
  * */
  public userId = 'U001';
  public userAccountId = 'UA001';
  public visit = 'V001';
  public autoRepairId = 'AR001';

  form = this.fb.group({
    star_rating: new FormControl<number | null>(null, { validators: [Validators.required] }),
    comment: new FormControl<string>(''),
  });

  selectRating(value: number) {
    this.form.controls.star_rating.setValue(value);
  }

  submit() {
    // Mark star_rating as touched to show validation errors
    this.form.controls.star_rating.markAsTouched();

    if (this.form.invalid) {
      return;
    }

    const newRating = new Rating({
      id_rating: 'RAT' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      star_rating: this.form.value.star_rating!,
      comment: this.form.value.comment ?? '',
      time_rating: new Date().toISOString().slice(0, 10), // Format: YYYY-MM-DD
      id_auto_repair: this.autoRepairId,
      id_user_account: this.userAccountId
    });

    this.store.addRating(newRating);
    this.router.navigate(['layout-owner/payment-service/rating/done']).then();
  }

}
