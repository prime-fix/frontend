import { Component } from '@angular/core';
import {inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {Router} from '@angular/router';

@Component({
  selector: 'app-payment-done',
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './payment-done.html',
  styleUrl: './payment-done.css'
})
export class PaymentDone {
  protected router = inject(Router);

  next() {
    this.router.navigate(['payment-service/rating']).then();
  }
}
