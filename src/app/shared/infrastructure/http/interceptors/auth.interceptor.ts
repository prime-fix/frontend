import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly API_KEY = environment.primeFixProviderApiKey;

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const authReq = request.clone({
      setHeaders: {
        'apiKey': this.API_KEY,
        'Authorization': `Bearer ${this.API_KEY}`,
      }
    });

    return next.handle(authReq);
  }
}
