import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { IamStore } from '@iam/application/iam-store';

/**
 * Role-based route guard
 * @param allowedRoles - Array of roles allowed to access the route
 * @returns CanActivateFn - Function to determine if route can be activated
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

    const { id_role: userRole, is_new: isNew } = sessionUserAccount;

    // Validate role exists (this should not happen with a valid session)
    if (!userRole || userRole === '') {
      console.warn('Role Guard: User role not found or invalid', {
        hasSessionUserAccount: !!sessionUserAccount,
        roleValue: userRole,
        sessionUserAccountKeys: Object.keys(sessionUserAccount)
      });
      return router.createUrlTree(['/login'], { queryParams: { redirect: state.url } });
    }

    // Check if user has allowed role FIRST (before checking isNew)
    if (!allowedRoles.includes(userRole)) {
      // User doesn't have the right role for this layout
      console.warn(`Role Guard: Access denied. User role: ${userRole}, Required: ${allowedRoles.join(', ')}`);
      const correctLayout = userRole === 'R001' ? '/layout-owner/dashboard-owner' : '/layout-workshop/dashboard-workshop';
      return router.createUrlTree([correctLayout]);
    }

    console.log(`Role Guard: Role ${userRole} is authorized for this layout`);

    // Handle new users - redirect to home if not already there
    if (isNew) {
      const newUserPath = userRole === 'R001' ? '/layout-owner/home-owner' : '/layout-workshop/home-workshop';

      // Only redirect if not already on the new user home page
      if (state.url !== newUserPath) {
        console.log(`Role Guard: Redirecting new user from ${state.url} to ${newUserPath}`);
        return router.createUrlTree([newUserPath]);
      }

      // Already on new user page, allow access
      console.log(`Role Guard: New user on correct home page ${state.url}`);
      return true;
    }

    // User has correct role and is not new, grant access
    console.log(`Role Guard: Access granted for role ${userRole} to ${state.url}`);
    return true;
  };
};
