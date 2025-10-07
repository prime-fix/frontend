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
  /**
   * Injecting the Router and IamStore services to check authentication status and handle redirection.
   */
  const router = inject(Router);
  /**
   * Injecting the IamStore to access the authentication state.
   */
  const iamStore  = inject(IamStore);

  /**
   * If the user is authenticated, allow access to the route.
   * If not, redirect to the login page with a query parameter for redirection after login.
   */
  return iamStore.isAuthenticated()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { redirect: state.url } });
};
