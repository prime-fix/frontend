import { Component, inject } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {Router} from '@angular/router';

@Component({
  selector: 'app-rating',
  imports: [MatCardModule,MatButtonModule,MatButtonModule],
  templateUrl: './rating.html',
  styleUrl: './rating.css'
})
export class Rating {
  protected router = inject(Router);

  onLater(){
    this.router.navigate(['payment-service/rating/done'])
  }

  onRateNow(){
    this.router.navigate((['payment-service/rating/form']))
  }
}
