import { Component, inject, Signal, computed } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {Router} from '@angular/router';
import {PaymentServiceStore} from '../../../application/payment-service-store';
import {Payment} from '../../../domain/model/payment.entity';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-payment-selection',
  imports: [MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule, TranslatePipe],
  templateUrl: './payment-selection.html',
  styleUrl: './payment-selection.css'
})
export class PaymentSelection {
  readonly store = inject(PaymentServiceStore);
  protected router = inject(Router);

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

  readonly payments: Signal<Payment[]> = computed(() => this.store.payments())
  selectedPayment: string | null = null;

  constructor() {
    this.store.loadPaymentsByUserAccountId(this.userAccountId);
  }

  goBack() {
    this.router.navigate(['/layout-owner/payment-service/payment']).then();
  }

  addMethod() {
    this.router.navigate(['/layout-owner/payment-service/payment/form']).then();
  }

  pay() {
    if (this.selectedPayment) {
      console.log('Pagando con:', this.selectedPayment);
      this.router.navigate(['/layout-owner/payment-service/payment/done']).then();
    } else {
      alert('Selecciona un método de pago antes de continuar.');
    }
  }



}
