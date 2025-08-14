import {ApplicationConfig, importProvidersFrom, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {authInterceptor} from './interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), // Otimiza detecção de mudanças
    provideRouter(routes), // Registra as rotas
    provideHttpClient(withInterceptors([authInterceptor])),   // Habilita HTTP Client
    importProvidersFrom(FormsModule) // permite fazer com que serviços(modo standalone) sejam injetados corretamente.
  ]
};

