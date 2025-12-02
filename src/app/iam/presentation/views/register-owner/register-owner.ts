import {Component, inject, signal, ChangeDetectionStrategy, effect} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {IamStore} from '@iam/application/iam-store';

@Component({
  selector: 'app-register-owner',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './register-owner.html',
  styleUrl: './register-owner.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterOwner {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  readonly store = inject(IamStore);

  isPasswordVisible = signal(false);

  constructor() {
    this.store.startRegistrationFlow('Vehicle Owner');
  }

  registerForm = this.fb.group({
    fullName: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.minLength(3)]}),
    username: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.minLength(3)]}),
    dni: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    phone_number: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    department: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    district: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    address: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] })
  });

  private _autoRedirect = effect(() => {
    // Check if registration data is saved (not authenticated yet, just data collected)
    const user = this.store.registerUser();
    const userAccount = this.store.registerUserAccount();

    if (user && userAccount) {
      const target = '/plan-owner';
      if (this.router.url !== target) {
        console.log('✅ Registration data saved, navigating to plan selection');
        void this.router.navigateByUrl(target);
      }
    }
  });

  togglePasswordVisibility() {
    this.isPasswordVisible.update(visible => !visible);
  }

  onSubmit() {
    if (this.registerForm.invalid || this.store.loading()) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formData = this.registerForm.getRawValue();
    console.log('📝 Register owner form data (saving to signals):', formData);

    // Save registration data to signals (NO POST yet, just in memory)
    this.store.saveRegisterOwner(formData);

    // Auto-redirect to plan-owner will be handled by _autoRedirect effect
  }

  navigateToLogin() {
    void this.router.navigateByUrl('/login');
  }

  navigateToPlanOwner() {
    void this.router.navigateByUrl('/plan-owner');
  }
}
