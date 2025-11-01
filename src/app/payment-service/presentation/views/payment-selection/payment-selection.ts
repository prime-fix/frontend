import { Component, inject, Signal, computed } from '@angular/core';
import {Router} from '@angular/router';
import {PaymentServiceStore} from '../../../application/payment-service-store';
import {Payment} from '../../../domain/model/payment.entity';
import {TranslatePipe} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-payment-selection',
  imports: [TranslatePipe, FormsModule],
  templateUrl: './payment-selection.html',
  styleUrl: './payment-selection.css'
})
export class PaymentSelection {
  readonly store = inject(PaymentServiceStore);
  protected router = inject(Router);

  /*
  * Usuario de prueba
  * */
  public userId = "U001";
  public userAccountId = "UA001";
  public visit = "V001";

  readonly payments: Signal<Payment[]> = computed(() => this.store.payments())
  selectedPayment: string | null = null;

  constructor() {
    this.store.loadPaymentsByUserAccountId(this.userAccountId);
  }

  goBack() {
    this.router.navigate(['layout-owner/payment-service/payment']).then();
  }

  addMethod() {
    this.router.navigate(['layout-owner/payment-service/payment/form']).then();
  }

  pay() {
    if (this.selectedPayment) {
      console.log('Pagando con:', this.selectedPayment);
      this.router.navigate(['layout-owner/payment-service/payment/done']).then();
    } else {
      alert('Selecciona un método de pago antes de continuar.');
    }
  }



}
