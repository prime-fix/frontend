import {Component, computed, signal} from '@angular/core';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {PaymentServiceStore} from '@payment/application/payment-service-store';
import {DataCollectionStore} from '@collections/application/data-collection-store';

@Component({
  selector: 'app-payment',
  imports: [TranslatePipe, FormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css'
})

export class Payment {
  private readonly paymentStore = inject(PaymentServiceStore);
  private readonly dataCollectionStore = inject(DataCollectionStore);
  protected router = inject(Router);

  /**
   * Selected payment method
   */
  readonly selectedMethod = signal<string>('');

  /**
   * Visits filtered by vehicle ID
   */
  public visitsByVehicleId = computed(() => {
    return this.dataCollectionStore.visits().filter(v => v.vehicle_id === this.paymentStore.vehicleIdFilter());
  })

  /**
   * Handles payment method change
   * @param value - selected payment method
   */
  onPaymentChange(value: string) {
    this.selectedMethod.set(value);
  }

  /**
   * Handles card payment method
   * @param card - boolean indicating card payment selection
   */
  cardMethod(card:Boolean){
    if(card){
      this.router.navigate(['layout-owner/payment-service/payment/selection']).then();
    }
  }

  /**
   * Handles cash payment method
   * @param cash - boolean indicating cash payment selection
   */
  cashMethod(cash:Boolean) {
    if(cash){
      this.router.navigate(['layout-owner/payment-service/payment/done']).then();
    }
  }

  /**
   * Handles acceptance of the selected payment method
   */
  onAccept() {
    if (this.selectedMethod() === 'cash') {
      this.cashMethod(true);
    } else if (this.selectedMethod() === 'card') {
      this.cardMethod(true);
    }
  }
}
