import {Component, Signal, computed} from '@angular/core';
import {inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import {PaymentServiceStore} from '../../../application/payment-service-store';
import {Router} from '@angular/router';
import {Visit} from '../../../domain/model/visit.entity';
import {TranslatePipe} from '@ngx-translate/core';



@Component({
  selector: 'app-payment',
  imports: [MatButtonModule, MatCardModule, MatRadioModule, TranslatePipe],
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
      this.router.navigate(['payment-service/payment/selection']).then();
    }
  }

  cashMethod(cash:Boolean) {
    if(cash){
      this.router.navigate(['payment-service/payment/done']).then();
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
