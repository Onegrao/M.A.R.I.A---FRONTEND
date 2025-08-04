import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { LoginComponent } from 'app/login/components/login.component';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(LoginComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations()
  ]
}).catch(err => console.error(err));
