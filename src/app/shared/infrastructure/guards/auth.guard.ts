import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { IamStore } from '@iam/application/iam-store';

export const authGuard: CanActivateFn = (_r, state) => {
  const router = inject(Router);
  const iamStore  = inject(IamStore);
  return iamStore.isAuthenticated()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { redirect: state.url } });
};
