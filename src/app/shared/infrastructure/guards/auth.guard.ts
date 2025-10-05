import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {SessionService} from '@shared/application/session.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  const session = inject(SessionService).snapshot();
  const isAuth = !!session.token?.accessToken;

  return isAuth ? true : router.createUrlTree(
    ['/login'],
    { queryParams: { redirect: state.url } }
  )
};
