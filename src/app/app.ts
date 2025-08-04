import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './login/components/login.component'; // Caminho ajustado
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

const config: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations()
  ]
};

bootstrapApplication(LoginComponent, config).catch(err => console.error(err));
