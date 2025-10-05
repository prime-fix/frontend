import { InjectionToken } from '@angular/core';

export const AUTH_HEADER_NAME = new InjectionToken<string>('AUTH_HEADER_NAME', {
  providedIn: 'root',
  factory: () => 'Authorization'
});
