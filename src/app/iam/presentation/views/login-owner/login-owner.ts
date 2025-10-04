import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {IamStore} from '@iam/application/iam-store';

@Component({
  selector: 'app-login-owner',
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './login-owner.html',
  styleUrl: './login-owner.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginOwner {
  private fb = inject(FormBuilder);
  readonly store = inject(IamStore);

  // Signals for state management
  isPasswordVisible = signal(false);
  isLoading = signal(false);

  // Reactive form
  loginForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

  }

  togglePasswordVisibility() {
    this.isPasswordVisible.update(visible => !visible);

  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      // TODO: Implement authentication logic later
      console.log('Login form submitted:', this.loginForm.value);

      // Simulate loading for mockup
      setTimeout(() => {
        this.isLoading.set(false);
      }, 2000);
    } else {
      // Mark all fields as touched to show validation errors
      this.loginForm.markAllAsTouched();
    }
  }

  navigateToRegister() {
    // TODO: Implement navigation to register page
    console.log('Navigate to register');
  }
}
