import { InjectionToken } from '@angular/core';

export const HTTP_TIMEOUT = new InjectionToken<number>('HTTP_TIMEOUT', {
  providedIn: 'root',
  factory: () => 15000
});
