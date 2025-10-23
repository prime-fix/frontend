import { Component, inject } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {Router} from '@angular/router'

@Component({
  selector: 'app-rating-done',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './rating-done.html',
  styleUrl: './rating-done.css'
})
export class RatingDone {
  protected router = inject(Router)

  goBack(){
    this.router.navigate(['payment-service/']).then()
  }
}
