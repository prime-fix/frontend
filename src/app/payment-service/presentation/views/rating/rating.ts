import { Component, inject } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-rating',
  imports: [MatCardModule, MatButtonModule, MatButtonModule, TranslatePipe],
  templateUrl: './rating.html',
  styleUrl: './rating.css'
})
export class Rating {
  protected router = inject(Router);

  onLater(){
    this.router.navigate(['/layout-owner/payment-service/rating/done'])
  }

  onRateNow(){
    this.router.navigate((['/layout-owner/payment-service/rating/form']))
  }
}
