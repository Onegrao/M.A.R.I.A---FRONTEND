import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators'; // Importar operadores RxJS

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);


  return authService.currentUser$.pipe(
    take(1), // Pega apenas o primeiro valor emitido (evita loops)
    map(user => {
      if (user?.is_staff) {
        return true; // É admin, permite acesso
      } else {
        // Não é admin, redireciona para home
        return router.createUrlTree(['/home']);
      }
    })
  );
};
