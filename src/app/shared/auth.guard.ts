// ARQUIVO NOVO: src/app/shared/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Importe seu AuthService

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verifica se existe um token de acesso
  if (authService.getToken()) {
    // Se tem token, permite o acesso à rota
    return true;
  }

  // Se não tem token, redireciona para a página de login
  console.log('AuthGuard: Acesso negado. Redirecionando para /login');
  router.navigate(['/login']);
  return false;
};
