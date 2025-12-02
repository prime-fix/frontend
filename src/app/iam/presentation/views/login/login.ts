import {Component, signal, ChangeDetectionStrategy, inject, effect} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {IamStore} from '@iam/application/iam-store';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  readonly store = inject(IamStore);

  // Signals for state management
  isPasswordVisible = signal(false);
  isLoading = signal(false);

  // Reactive form
  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  private _autoRedirect = effect(() => {
    if (!this.store.isAuthenticated()) return;
    const redirect = this.route.snapshot.queryParamMap.get('redirect');
    const byRole = this.store.roleId() === 1 ? '/layout-owner' : '/layout-workshop';
    const target = redirect || byRole;
    if (this.router.url !== target) {
      void this.router.navigateByUrl(target);
    }
  });

  togglePasswordVisibility() {
    this.isPasswordVisible.update(visible => !visible);
  }

  onSubmit() {
    if (this.loginForm.invalid || this.store.loading()) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { username, password } = this.loginForm.getRawValue();
    this.store.login(username, password);
  }

  navigateToRegister() {
    void this.router.navigateByUrl('/user-role');
  }
}
