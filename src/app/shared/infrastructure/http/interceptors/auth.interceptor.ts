import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {environment} from '@env/environment';
import {Observable} from 'rxjs';

/**
 * Shape of the session object stored in local storage.
 */
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
  /**
   * The API key used for authentication.
   * @private
   */
  private readonly API_KEY = environment.primeFixProviderApiKey;
  /**
   * The base URL of the API to which the interceptor applies.
   * @private
   */
  private readonly API_BASE = environment.primeFixProviderApiBaseUrl;
  /**
   * The key used to store authentication data in local storage.
   * @private
   */
  private readonly AUTH_STORAGE_KEY = 'pf_iam_auth';

  /**
   * Intercepts HTTP requests to add authentication headers.
   * @param request - The outgoing HTTP request.
   * @param next - The next handler in the HTTP request chain.
   */
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

  /**
   * Reads the access token from local storage.
   * @private - This method is intended for internal use only.
   * @returns The access token if available, otherwise null.
   */
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

  /**
   * Determines if the request URL is for assets.
   * @param url - The request URL.
   * @private - This method is intended for internal use only.
   * @returns True if the URL is for assets, otherwise false.
   */
  private isAssetsRequest(url: string): boolean {
    return url.startsWith('/assets/') || url.includes('/assets/i18n/');
  }

  /**
   * Checks if the request URL matches the API base URL.
   * @param url - The request URL.
   * @private - This method is intended for internal use only.
   * @returns True if the URL matches the API base, otherwise false.
   */
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
