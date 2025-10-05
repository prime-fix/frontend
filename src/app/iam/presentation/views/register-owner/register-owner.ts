import {Component, inject, signal, ChangeDetectionStrategy, effect} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
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

  registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  private _autoRedirect = effect(() => {
    if (!this.store.isAuthenticated()) return;
    const target = '/layout-owner';
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
    // TODO: Implementar registro en el store
    console.log('Register owner data:', formData);

    // Simular registro exitoso por ahora
    // this.store.registerOwner(formData);
  }

  navigateToLogin() {
    void this.router.navigateByUrl('/login');
  }
}
