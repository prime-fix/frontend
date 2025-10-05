import {AbstractControl, ValidatorFn} from '@angular/forms';

export const emailValidator = (): ValidatorFn => (c: AbstractControl) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(c.value)) ? null : { email: true };

export const passwordStrengthValidator = (): ValidatorFn => (c: AbstractControl) => {
  const v = String(c.value ?? '');
  const ok = v.length >= 8 && /[A-Z]/.test(v) && /[a-z]/.test(v) && /\d/.test(v);
  return ok ? null : { weakPassword: true };
};
