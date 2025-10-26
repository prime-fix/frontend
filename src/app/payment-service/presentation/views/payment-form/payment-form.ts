import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { PaymentServiceStore } from '../../../application/payment-service-store';
import { Payment } from '../../../domain/model/payment.entity';
import {MatCardModule} from '@angular/material/card';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-payment-form',
  imports: [ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule, TranslatePipe],
  templateUrl: './payment-form.html',
  styleUrl: './payment-form.css'
})
export class PaymentForm {
  private fb = inject(FormBuilder);
  private store = inject(PaymentServiceStore);
  private router = inject(Router);

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

  readonly months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  readonly years = Array.from({ length: 10 }, (_, i) => 2025 + i);
  readonly cardTypes = ['Débito', 'Crédito'];
  readonly docTypes = ['DNI', 'Carnet de extranjería', 'Pasaporte'];

  form = this.fb.group({
    card_number: new FormControl<number | null>(null, { nonNullable: true, validators: [Validators.required, Validators.minLength(16), Validators.maxLength(16)] }),
    card_type: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    month: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    year: new FormControl<number | null>(null, { validators: [Validators.required] }),
    cvv: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(100), Validators.max(999)] }),
    doc_type: new FormControl<string>('', { nonNullable: true }),
    doc_number: new FormControl<string>('', { nonNullable: true }),
  });

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Por favor, completa todos los campos obligatorios correctamente.');
      return;
    }

    const payment = new Payment({
      id_payment: 'PAY' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      card_number: this.form.value.card_number!,
      card_type: this.form.value.card_type!,
      month: this.monthToNumber(this.form.value.month!),
      year: this.form.value.year!,
      cvv: this.form.value.cvv!,
      id_user_account: this.userAccountId
    });
  }

  private monthToNumber(month: string): number {
    const map: Record<string, number> = {
      Enero: 1, Febrero: 2, Marzo: 3, Abril: 4, Mayo: 5, Junio: 6,
      Julio: 7, Agosto: 8, Septiembre: 9, Octubre: 10, Noviembre: 11, Diciembre: 12
    };
    return map[month] ?? 1;
  }


}
