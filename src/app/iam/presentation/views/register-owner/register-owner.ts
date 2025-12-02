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
    if (!this.store.isAuthenticated()) return;
    const target = '/plan-owner';
    if (this.router.url !== target) {
      void this.router.navigateByUrl(target);
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
    console.log('📝 Register owner form data:', formData);

    // Register with AWS API (auto-login with JWT)
    this.store.registerVehicleOwner(formData);
    // Auto-redirect will be handled by _autoRedirect effect when authenticated
  }

  navigateToLogin() {
    void this.router.navigateByUrl('/login');
  }

  navigateToPlanOwner() {
    void this.router.navigateByUrl('/plan-owner');
  }
}
