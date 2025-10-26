import {Component, Signal, computed} from '@angular/core';
import {inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import {PaymentServiceStore} from '../../../application/payment-service-store';
import {Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {Visit} from '@collections/domain/model/visit.entity';



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
  public userId = "U002";
  public userAccountId = "UA002";
  public visit = "V001";

  public visitAux = {
    "id_visit": "V001",
    "failure": "El motor hace un ruido extraño",
    "time_visit": "2025-10-16",
    "id_auto_repair": "AR001",
    "id_service": "S002",
    "status": "Completado",
    "price": "500.00",
    "id_vehicle": "RV001"};

  public vehicle = {
    "id_vehicle": "RV001",
    "model": "Corolla",
    "id_user": "U001",
    "vehicle_brand": "Toyota",
    "vehicle_plate": "ABC-123",
    "vehicle_type": "Sedan",
    "color": "Rojo"
  }

  onPaymentChange(value: string) {
    this.selectedMethod = value;
  }

  readonly visitData: Signal<Visit | undefined> = computed(() =>
  this.store.getVisitById(this.visit))()

  cardMethod(card:Boolean){
    if(card){
      this.router.navigate(['/layout-owner/payment-service/payment/selection']).then();
    }
  }

  cashMethod(cash:Boolean) {
    if(cash){
      this.router.navigate(['/layout-owner/payment-service/payment/done']).then();
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
