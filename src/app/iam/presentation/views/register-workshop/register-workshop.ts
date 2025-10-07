import {Component, inject, signal, ChangeDetectionStrategy, effect} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
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
    name_workshop: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.minLength(3)]}),
    username: new FormControl('',{ nonNullable: true, validators: [Validators.required, Validators.minLength(3)]}),
    ruc: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{11}$/)] }),
    phone_number: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    department: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    district: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    address: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
  });

  private _autoRedirect = effect(() => {
    if (!this.store.isAuthenticated()) return;
    const target = '/plan-workshop';
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
    console.log('Register workshop data:', formData);

    this.store.startRegistrationFlow('Auto Repair Shop');
    this.store.saveRegisterWorkshop(formData);
    this.navigateToPlanWorkshop();
  }

  navigateToLogin() {
    void this.router.navigateByUrl('/login');
  }

  navigateToPlanWorkshop() {
    void this.router.navigateByUrl('/plan-workshop');
  }
}
