import {
  ApplicationConfig, inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi} from '@angular/common/http';
import {provideTranslateService, TranslateService} from '@ngx-translate/core';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';
import {AuthInterceptor} from '@shared/infrastructure/http/interceptors/auth.interceptor';
import {IamStore} from '@iam/application/iam-store';

/**
 * Initialize stores after app is fully bootstrapped
 * This prevents NG0203 errors during route guard initialization
 */
function initializeStores() {
  return () => {
    const iamStore = inject(IamStore);
    // Store initialization happens here, after all dependencies are resolved
    console.log('✅ App fully initialized, stores ready');
    return Promise.resolve();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch()
    ),
    provideTranslateService({
      loader: provideTranslateHttpLoader({prefix: './assets/i18n/', suffix: '.json'}),
      lang: 'en',
      fallbackLang: 'en'
    }),
    provideAppInitializer(() => {
      const translate = inject(TranslateService);
      translate.use(translate.getBrowserLang() || "en");
    }),
    // Initialize stores after translation is ready
    provideAppInitializer(initializeStores()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
};
