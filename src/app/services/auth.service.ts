import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import {environment}  from '../../environments/environments';

// Interface para a resposta do token do Django
export interface AuthResponse {
  access: string;
  refresh: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/api/token/`;

  constructor(private http: HttpClient, private router: Router) { }


  login(usuario: string, senha: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl, { username: usuario, password: senha })
      .pipe(
        tap(response => {
          // Se o login for bem-sucedido, armazena o token
          this.setSession(response);
        })
      );
  }

  private setSession(authResult: AuthResponse) {
    localStorage.setItem('access_token', authResult.access);
  }

  logout() {

    localStorage.removeItem('access_token');
    // Navega o usuário de volta para a página de login
    this.router.navigate(['/login']);
  }
}
