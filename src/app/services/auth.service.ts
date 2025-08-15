import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environments';
import { jwtDecode } from 'jwt-decode'; // Usado para verificar se o usuário é admin

// Interface para a resposta do token do Django
export interface AuthResponse {
  access: string;
  refresh: string;
}

// Interface para o payload decodificado do token
interface DecodedToken {
  is_staff: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/api/token/`;

  constructor(private http: HttpClient, private router: Router) {}

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
    // Redireciona o usuário para a página de login
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  //Verifica se o usuário logado é admin.
  //Usa o campo "is_staff" enviado no token pelo backend Django.

  isUserAdmin(): boolean {
    const token = this.getToken();

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        return decoded.is_staff === true;
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
        return false;
      }
    }

    return false;
  }
}
