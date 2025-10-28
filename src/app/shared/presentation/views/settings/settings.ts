import {Component, inject, signal, computed} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {IamStore} from '@iam/application/iam-store';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, TranslateModule, CommonModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {
  private fb = inject(FormBuilder);
  private iamStore = inject(IamStore);

  /**
   * Session user account observable
   */
  sessionUserAccount = this.iamStore.sessionUserAccount;

  /**
   * UI Signals
   */
  showPasswordFields = signal(false);
  showAddPaymentModal = signal(false);

  /**
   * Payments filtered by session user account ID
   */
  paymentByUserAccountId = computed(() => {
    const userAccount = this.sessionUserAccount();
    if (!userAccount) return [];

    return this.iamStore.payments().filter(payment => payment.id_user_account === userAccount.id);
  })

  /**
   * Subscription info based on user account membership ID
   */
  subscriptionInfo = computed(() => {
    const userAccount = this.sessionUserAccount();
    if (!userAccount) return null;

    const membershipId = userAccount.id_membership;
    let months = 0;
    let price = '0.00';

    if (membershipId === 'M001') {
      months = 1;
      price = '39.00';
    } else if (membershipId === 'M002') {
      months = 3;
      price = '99.00';
    } else if (membershipId === 'M003') {
      months = 12;
      price = '349.00';
    }

    return { months, price };
  });

  /**
   * Password Form
   */
  passwordForm = this.fb.group({
    newPassword: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
    repeatPassword: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] })
  });

  /**
   * Payment Form
   */
  paymentForm = this.fb.group({
    card_number: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required] }),
    month: new FormControl<number>(1, { nonNullable: true, validators: [Validators.required] }),
    year: new FormControl<number>(new Date().getFullYear(), { nonNullable: true, validators: [Validators.required] }),
    cvv: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required] }),
    card_type: new FormControl<string>('Visa', { nonNullable: true, validators: [Validators.required] }),
  });

  /**
   * Months and Years for Payment Form
   */
  months = [
    { value: 1, name: 'Enero' },
    { value: 2, name: 'Febrero' },
    { value: 3, name: 'Marzo' },
    { value: 4, name: 'Abril' },
    { value: 5, name: 'Mayo' },
    { value: 6, name: 'Junio' },
    { value: 7, name: 'Julio' },
    { value: 8, name: 'Agosto' },
    { value: 9, name: 'Septiembre' },
    { value: 10, name: 'Octubre' },
    { value: 11, name: 'Noviembre' },
    { value: 12, name: 'Diciembre' }
  ];
  years = Array.from({length: 10}, (_, i) => new Date().getFullYear() + i);

  /**
   * Toggle password visibility
   * @param inputId - ID of the password input element
   */
  togglePasswordVisibility(inputId: string): void {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
  }

  /**
   * Save new password
   */
  onSavePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { newPassword, repeatPassword } = this.passwordForm.getRawValue();
    if (newPassword !== repeatPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // TODO: Implementar lógica para cambiar contraseña
    console.log('Cambiar contraseña:', newPassword);
    this.passwordForm.reset();
    this.showPasswordFields.set(false);
  }

  /**
   * Delete payment method
   * @param paymentId - ID of the payment method to delete
   */
  onDeletePayment(paymentId: string): void {
    if (confirm('¿Está seguro de eliminar este método de pago?')) {
      this.iamStore.deletePayment(paymentId);
    }
  }

  /**
   * Show add payment method modal
   */
  onAddPaymentMethod(): void {
    this.showAddPaymentModal.set(true);
  }

  /**
   * Close add payment method modal
   */
  onClosePaymentModal(): void {
    this.showAddPaymentModal.set(false);
    this.paymentForm.reset();
  }

  /**
   * Submit new payment method
   */
  onSubmitPayment(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const formData = this.paymentForm.getRawValue();
    // TODO: Aquí debes implementar la lógica para añadir el método de pago
    console.log('Añadir método de pago:', formData);
    this.onClosePaymentModal();
  }

  onRenewSubscription(): void {
    // TODO: Implementar lógica para renovar suscripción
    console.log('Renovar suscripción');
  }

  getCardBrand(cardNumber: number): string {
    const firstDigit = cardNumber.toString()[0];
    if (firstDigit === '4') return 'Visa';
    if (firstDigit === '5') return 'Mastercard';
    return 'Desconocido';
  }

  formatCardNumber(cardNumber: number): string {
    const str = cardNumber.toString();
    return str.replace(/(\d{4})/g, '$1 ').trim();
  }
}
