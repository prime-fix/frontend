import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Payment } from '../../../domain/model/payment.entity';
import {TranslatePipe} from '@ngx-translate/core';
import {IamStore} from '@iam/application/iam-store';
import {PaymentServiceStore} from '@payment/application/payment-service-store';

@Component({
  selector: 'app-payment-form',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './payment-form.html',
  styleUrl: './payment-form.css'
})
export class PaymentForm {
  private fb = inject(FormBuilder);
  private iamStore = inject(IamStore);
  private paymentServiceStore = inject(PaymentServiceStore);

  /**
   * Gets the user account ID from the IAM store.
   */
  public userAccountId = this.iamStore.sessionUserAccountId;

  /**
   * List of month names in Spanish.
   */
  readonly months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  /**
   * List of years from 2025 to 2034.
   */
  readonly years = Array.from({ length: 10 }, (_, i) => 2025 + i);
  /**
   * List of card types.
   */
  readonly cardTypes = ['Débito', 'Crédito'];
  /**
   * List of document types.
   */
  readonly docTypes = ['DNI', 'Carnet de extranjería', 'Pasaporte'];

  /**
   * Reactive form for payment details.
   */
  form = this.fb.group({
    card_number: new FormControl<string | null>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(16), Validators.maxLength(16)] }),
    card_type: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    month: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    year: new FormControl<number | null>(null, { validators: [Validators.required] }),
    ccv: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(100), Validators.max(999)] }),
    doc_type: new FormControl<string>('', { nonNullable: true }),
    doc_number: new FormControl<string>('', { nonNullable: true }),
  });

  /**
   * Submits the payment form.
   */
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      alert('Por favor, completa todos los campos obligatorios correctamente.');
      return;
    }

    const payment = new Payment({
      id: 0, // This will be set by the backend
      card_number: this.form.value.card_number!,
      card_type: this.form.value.card_type!,
      month: this.monthToNumber(this.form.value.month!),
      year: this.form.value.year!,
      ccv: this.form.value.ccv!,
      user_account_id: this.userAccountId()!
    });

    // Call the store to add the payment
    this.paymentServiceStore.addPayment(payment);
  }

  /**
   * Converts a month name in Spanish to its corresponding number.
   * @param month - The month name in Spanish.
   * @returns The month number (1-12).
   * @private
   */
  private monthToNumber(month: string): number {
    const map: Record<string, number> = {
      Enero: 1, Febrero: 2, Marzo: 3, Abril: 4, Mayo: 5, Junio: 6,
      Julio: 7, Agosto: 8, Septiembre: 9, Octubre: 10, Noviembre: 11, Diciembre: 12
    };
    return map[month] ?? 1;
  }

}
