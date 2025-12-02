import {Component, inject, computed, signal} from '@angular/core';
import {Router} from '@angular/router';
import {PaymentServiceStore} from '../../../application/payment-service-store';
import {TranslatePipe} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {IamStore} from '@iam/application/iam-store';

@Component({
  selector: 'app-payment-selection',
  imports: [TranslatePipe, FormsModule],
  templateUrl: './payment-selection.html',
  styleUrl: './payment-selection.css'
})
export class PaymentSelection {
  readonly paymentServiceStore = inject(PaymentServiceStore);
  readonly iamStore = inject(IamStore);
  protected router = inject(Router);

  /**
   * ID of the user account from the IAM store
   */
  public userAccountId = this.iamStore.sessionUserAccountId;

  /**
   * Filtered payments by the current user account ID
   */
  readonly paymentFilterByUserId = computed(() => {
    return this.paymentServiceStore.payments().filter(p => p.user_account_id === this.userAccountId())
  })

  /**
   * Selected payment method ID
   */
  readonly selectedPayment = signal<string | null>(null);

  /**
   * Navigate back to the payment overview page
   */
  goBack() {
    this.router.navigate(['layout-owner/payment-service/payment']).then();
  }

  /**
   * Navigate to the add payment method form
   */
  addMethod() {
    this.router.navigate(['layout-owner/payment-service/payment/form']).then();
  }

  selectPaymentMethod(paymentId: string) {
    this.selectedPayment.set(paymentId);
  }

  /**
   * Proceed to payment confirmation if a payment method is selected
   */
  pay() {
    if (this.selectedPayment()) {
      console.log('Pagando con:', this.selectedPayment);
      this.router.navigate(['layout-owner/payment-service/payment/done']).then();
    } else {
      alert('Selecciona un método de pago antes de continuar.');
    }
  }
}
