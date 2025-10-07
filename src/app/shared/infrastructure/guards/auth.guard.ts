import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { IamStore } from '@iam/application/iam-store';

/**
 * Authentication guard to protect routes that require user authentication.
 * @param _r - The activated route snapshot (not used).
 * @param state - The router state snapshot.
 * @returns True if the user is authenticated, otherwise redirects to the login page with a redirect URL.
 */
export const authGuard: CanActivateFn = (_r, state) => {
  const router = inject(Router);
  const iamStore  = inject(IamStore);
  return iamStore.isAuthenticated()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { redirect: state.url } });
};
