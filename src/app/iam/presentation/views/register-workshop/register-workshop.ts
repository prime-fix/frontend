import {Component, inject, signal, ChangeDetectionStrategy, effect} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {IamStore} from '@iam/application/iam-store';

@Component({
  selector: 'app-register-workshop',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './register-workshop.html',
  styleUrl: './register-workshop.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterWorkshop {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  readonly store = inject(IamStore);

  isPasswordVisible = signal(false);

  registerForm = this.fb.group({
    workshopName: ['', [Validators.required, Validators.minLength(3)]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    ruc: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
    department: ['', [Validators.required]],
    district: ['', [Validators.required]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  private _autoRedirect = effect(() => {
    if (!this.store.isAuthenticated()) return;
    const target = '/layout-workshop';
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
    console.log('Register workshop data:', formData);

    // Simular registro exitoso por ahora
    // this.store.registerWorkshop(formData);
  }

  navigateToLogin() {
    void this.router.navigateByUrl('/login');
  }
}
