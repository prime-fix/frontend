import {Component, Signal, computed} from '@angular/core';
import {inject} from '@angular/core';
import {PaymentServiceStore} from '../../../application/payment-service-store';
import {Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {Visit} from '@collections/domain/model/visit.entity';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-payment',
  imports: [TranslatePipe, FormsModule],
  templateUrl: './payment.html',
  styleUrl: './payment.css'
})

export class Payment {
  readonly store = inject(PaymentServiceStore);
  protected router = inject(Router);

  public card = false;
  public cash = false;

  selectedMethod = '';

  /*
  * Usuario de prueba
  * */
  public userId = "U001";
  public userAccountId = "UA001";
  public visit = "V001";

  onPaymentChange(value: string) {
    this.selectedMethod = value;
  }

  readonly visitData: Signal<Visit | undefined> = computed(() =>
  this.store.getVisitById(this.visit))()

  cardMethod(card:Boolean){
    if(card){
      this.router.navigate(['layout-owner/payment-service/payment/selection']).then();
    }
  }

  cashMethod(cash:Boolean) {
    if(cash){
      this.router.navigate(['layout-owner/payment-service/payment/done']).then();
    }
  }


  onAccept() {
    if (this.selectedMethod === 'cash') {
      this.cashMethod(true);
    } else if (this.selectedMethod === 'card') {
      this.cardMethod(true);
    }
  }

}
