import {Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {RoleChoiceType} from '@iam/domain/types/role-choice.type';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-user-role',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './user-role.html',
  styleUrl: './user-role.css'
})
export class UserRole {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  submitting = signal(false);

  form = this.fb.group({
    role: ['', Validators.required] // 'Vehicle Owner' | 'Workshop'
  });

  selectRole(role: RoleChoiceType) {
    this.form.patchValue({ role });
    this.form.controls.role.markAsTouched();
  }

  onSubmit() {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);

    const choice = this.form.value.role as RoleChoiceType;

    const target = choice === 'Vehicle Owner'
        ? '/register-owner'
        : '/register-workshop';

    void this.router.navigateByUrl(target).finally(() => this.submitting.set(false));
  }
}
