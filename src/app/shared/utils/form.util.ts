import {AbstractControl} from '@angular/forms';

export const isInvalid = (c: AbstractControl | null) =>
  !!c && c.invalid && (c.dirty || c.touched);
