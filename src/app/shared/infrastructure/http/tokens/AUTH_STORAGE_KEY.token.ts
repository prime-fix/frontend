import { InjectionToken } from '@angular/core';

export const AUTH_STORAGE_KEY = new InjectionToken<string>('AUTH_STORAGE_KEY', {
  providedIn: 'root',
  factory: () => 'pf_iam_auth'
});
