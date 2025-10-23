import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {

  // 1. Pega o token de acesso do localStorage.
  const token = localStorage.getItem('access_token');

  // 2. Se não houver token, deixa a requisição passar sem modificações.
  if (!token || !req.url.includes('/api/')) {
    return next(req);
  }

  // 3. Se houver token, clona a requisição e adiciona o cabeçalho.
  const clonedRequest = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });

  // 4. Envia a requisição clonada.
  return next(clonedRequest);
};
