import {Component, inject, signal, computed} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {IamStore} from '@iam/application/iam-store';
import {toSignal} from '@angular/core/rxjs-interop';
import {UserAccount} from '@iam/domain/model/user-account.entity';

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
   * Password visibility signal
   */
  isPasswordVisible = signal(false);

  /**
   * Repeat Password visibility signal
   */
  isRepeatPasswordVisible = signal(false);

  /**
   * Session user account observable
   */
  sessionUserAccount = this.iamStore.sessionUserAccount;

  /**
   * Password Fields visibility signal
   */
  showPasswordFields = signal(false);
  /**
   * Add Payment Modal visibility signal
   */
  showAddPaymentModal = signal(false);

  /**
   * Payments filtered by session user account ID
   */
  paymentByUserAccountId = computed(() => {
    const userAccount = this.sessionUserAccount();
    if (!userAccount) return [];

    return this.iamStore.payments().filter(payment => payment.user_account_id === userAccount.id);
  })

  /**
   * Subscription info based on user account membership ID
   */
  subscriptionInfo = computed(() => {
    const userAccount = this.sessionUserAccount();
    if (!userAccount) return null;

    const membershipId = userAccount.membership_id;
    let months = 0;
    let price = '0.00';

    if (membershipId === 1) {
      months = 1;
      price = '39.00';
    } else if (membershipId === 2) {
      months = 3;
      price = '99.00';
    } else if (membershipId === 3) {
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
   * Convert form value changes to signals for reactivity
   */
  newPasswordValue = toSignal(this.passwordForm.controls.newPassword.valueChanges, { initialValue: '' });
  repeatPasswordValue = toSignal(this.passwordForm.controls.repeatPassword.valueChanges, { initialValue: '' });
  newPasswordStatus = toSignal(this.passwordForm.controls.newPassword.statusChanges, { initialValue: 'INVALID' });
  repeatPasswordStatus = toSignal(this.passwordForm.controls.repeatPassword.statusChanges, { initialValue: 'INVALID' });

  /**
   * Form validity signal
   */
  passwordFormValid = computed(() => {
    // Trigger reactivity by reading both status signals
    this.newPasswordStatus();
    this.repeatPasswordStatus();
    return this.passwordForm.valid;
  });

  /**
   * New Password Form Control - for template access
   */
  newPasswordControl = computed(() => this.passwordForm.controls.newPassword);
  /**
   * Repeat Password Form Control - for template access
   */
  repeatPasswordControl = computed(() => this.passwordForm.controls.repeatPassword);

  /**
   * Check if passwords match
   */
  passwordsMatch = computed(() => {
    const newPassword = this.newPasswordValue();
    const repeatPassword = this.repeatPasswordValue();
    return newPassword === repeatPassword && newPassword.length >= 6 && repeatPassword.length >= 6;
  });

  /**
   * Password match message
   */
  passwordErrorMatchMessage = computed(() => {
    return this.passwordsMatch() ? 'settings-view.passwordsMatch' : 'settings-view.passwordsNotMatch';
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
    this.isPasswordVisible.update(visible => !visible);
  }

  toggleRepeatPasswordVisibility(inputId: string): void {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
    this.isRepeatPasswordVisible.update(visible => !visible);
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

    const updatedUserAccount = new UserAccount({
     id: this.sessionUserAccount()?.id!,
      username: this.sessionUserAccount()?.username!,
      email: this.sessionUserAccount()?.email!,
      user_id: this.sessionUserAccount()?.user_id!,
      role_id: this.sessionUserAccount()?.role_id!,
      membership_id: this.sessionUserAccount()?.membership_id!,
      password: newPassword,
      is_new: this.sessionUserAccount()?.is_new!
    });

    this.iamStore.updateUserAccount(updatedUserAccount);
    this.passwordForm.reset();
    this.showPasswordFields.set(false);
  }

  /**
   * Delete payment method
   * @param paymentId - ID of the payment method to delete
   */
  onDeletePayment(paymentId: number): void {
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

  getCardBrand(cardNumber: string): string {
    const firstDigit = cardNumber.toString()[0];
    if (firstDigit === '4') return 'Visa';
    if (firstDigit === '5') return 'Mastercard';
    return 'Desconocido';
  }

  formatCardNumber(cardNumber: string): string {
    const str = cardNumber.toString();
    return str.replace(/(\d{4})/g, '$1 ').trim();
  }
}
