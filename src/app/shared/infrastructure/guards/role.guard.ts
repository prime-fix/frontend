import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { IamStore } from '@iam/application/iam-store';

/**
 * Role guard to protect routes based on user role.
 * @param allowedRoles - Array of allowed role IDs for the route.
 * @returns A guard function that checks if the user has the required role.
 */
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (_r, state) => {
    const router = inject(Router);
    const iamStore = inject(IamStore);

    // Get the session user account directly
    const sessionUserAccount = iamStore.sessionUserAccount();

    // Check if user is authenticated
    if (!sessionUserAccount) {
      console.warn('Role Guard: User not authenticated - no session found');
      return router.createUrlTree(['/login'], { queryParams: { redirect: state.url } });
    }

    const userRole = sessionUserAccount.id_role;

    // Validate role exists (this should not happen with a valid session)
    if (!userRole || userRole === '') {
      console.warn('Role Guard: User role not found or invalid', {
        hasSessionUserAccount: !!sessionUserAccount,
        roleValue: userRole,
        sessionUserAccountKeys: Object.keys(sessionUserAccount)
      });
      return router.createUrlTree(['/login'], { queryParams: { redirect: state.url } });
    }

    // Check if user has allowed role
    if (allowedRoles.includes(userRole)) {
      console.log(`Role Guard: Access granted for role ${userRole}`);
      return true;
    }

    // Redirect to appropriate layout if user tries to access wrong role's route
    console.warn(`Role Guard: Access denied. User role: ${userRole}, Required: ${allowedRoles.join(', ')}`);
    const correctLayout = userRole === 'R001' ? '/layout-owner/home-owner' : '/layout-workshop/home-workshop';
    return router.createUrlTree([correctLayout]);
  };
};

