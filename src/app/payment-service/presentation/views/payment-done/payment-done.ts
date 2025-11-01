import { Component } from '@angular/core';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-payment-done',
  imports: [TranslatePipe],
  templateUrl: './payment-done.html',
  styleUrl: './payment-done.css'
})
export class PaymentDone {
  protected router = inject(Router);

  next() {
    this.router.navigate(['layout-owner/payment-service/rating']).then();
  }
}
