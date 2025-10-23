import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject, of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environments';
import { PerfilUsuario, UsuarioService } from './usuario.service'; // Importar Perfil

export interface AuthResponse {
  access: string;
  refresh: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  private currentUserSubject = new BehaviorSubject<PerfilUsuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private usuarioService: UsuarioService
  ) {
    this.loadInitialUser();
  }

  public get isAdmin(): boolean {
    return !!this.currentUserSubject.value?.is_staff;
  }

  loadInitialUser(): void {
    const token = this.getToken();
    if (token && !this.currentUserSubject.value) { // Só carrega se não tiver usuário
      this.usuarioService.getPerfil().subscribe({
        next: (perfil) => this.currentUserSubject.next(perfil),
        // Se der erro ao buscar perfil (token expirado?), desloga
        error: () => this.logout()
      });
    } else if (!token) {
      this.currentUserSubject.next(null); // Limpa se não houver token
    }
  }

  login(usuario: string, senha: string): Observable<AuthResponse> {
    const loginUrl = `${this.apiUrl}/token/`;
    return this.http.post<AuthResponse>(loginUrl, { username: usuario, password: senha })
      .pipe(
        tap(response => {
          this.setSession(response);
          this.loadInitialUser(); // Busca o perfil após login
        })
      );
  }

  private setSession(authResult: AuthResponse) {
    localStorage.setItem('access_token', authResult.access);
  }

  logout() {
    localStorage.removeItem('access_token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
