import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError, timeout, catchError } from 'rxjs';
import { HTTP_TIMEOUT } from '@shared/infrastructure/http/tokens/HTTP_TIMEOUT.token';

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
  private readonly ms = inject(HTTP_TIMEOUT);
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(timeout(this.ms), catchError(err => throwError(() => err)));
  }
}
