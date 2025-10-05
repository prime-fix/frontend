import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';

interface SessionShape {
  token?: { accessToken?: string };
}

/**
 * An HTTP interceptor that adds authentication headers to outgoing requests.
 * It attaches an API key and, if available, a Bearer token from local storage.
 * Requests to asset URLs are excluded from this interception.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly API_KEY = environment.primeFixProviderApiKey;
  private readonly API_BASE = environment.primeFixProviderApiBaseUrl;
  private readonly AUTH_STORAGE_KEY = 'pf_iam_auth';

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.isAssetsRequest(request.url) || !this.matchesApiBase(request.url)) {
      return next.handle(request);
    }

    const accessToken = this.readAccessToken();
    const setHeaders: Record<string, string> = {
      'apiKey': this.API_KEY,
    };

    if (!request.headers.has('Authorization')) {
      if (accessToken) {
        setHeaders['Authorization'] = `Bearer ${accessToken}`;
      } else {
      }
    }

    const authReq = request.clone({ setHeaders });
    return next.handle(authReq);
  }

  private readAccessToken(): string | null {
    try {
      const raw = localStorage.getItem(this.AUTH_STORAGE_KEY);
      if (!raw) return null;
      const snap = JSON.parse(raw) as SessionShape;
      return snap?.token?.accessToken ?? null;
    } catch {
      return null;
    }
  }

  private isAssetsRequest(url: string): boolean {
    return url.startsWith('/assets/') || url.includes('/assets/i18n/');
  }

  private matchesApiBase(url: string): boolean {
    try {
      const req = new URL(url, window.location.origin);
      const api = new URL(this.API_BASE, window.location.origin);
      return req.origin === api.origin && req.pathname.startsWith(api.pathname);
    } catch {
      return true;
    }
  }
}
