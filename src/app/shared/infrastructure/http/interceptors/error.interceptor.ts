import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((e: unknown) => {
        if (e instanceof HttpErrorResponse) {
          const message = (e.error && (e.error.message || e.error.error || e.error.title))
            || e.message || 'HTTP Error';
          return throwError(() => new Error(`${message} (status: ${e.status})`));
        }
        return throwError(() => e);
      })
    );
  }
}
