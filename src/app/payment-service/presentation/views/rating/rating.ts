import { Component, inject } from '@angular/core';
import {Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-rating',
  imports: [TranslatePipe],
  templateUrl: './rating.html',
  styleUrl: './rating.css'
})
export class Rating {
  protected router = inject(Router);

  /**
   * Navigates to the 'done' page when the user chooses to rate later.
   */
  onLater(){
    this.router.navigate(['layout-owner/payment-service/rating/done']).then();
  }

  /**
   * Navigates to the rating form when the user chooses to rate now.
   */
  onRateNow(){
    this.router.navigate((['layout-owner/payment-service/rating/form'])).then();
  }
}
