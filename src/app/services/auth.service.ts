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

  // O BehaviorSubject mantém o último valor do perfil
  private currentUserSubject = new BehaviorSubject<PerfilUsuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private usuarioService: UsuarioService // Injeta o serviço de usuário
  ) {
    this.loadInitialUser(); // Carrega o usuário ao iniciar o serviço
  }

  // Helper para verificar Admin (is_staff)
  public get isAdmin(): boolean {
    return !!this.currentUserSubject.value?.is_staff;
  }

  // --- MODIFICAÇÃO INICIA (Helpers de Função) ---
  public isGerente(): boolean {
    return this.currentUserSubject.value?.funcao === 'GERENTE';
  }

  public isTecnico(): boolean {
    return this.currentUserSubject.value?.funcao === 'TECNICO';
  }

  public isOperador(): boolean {
    return this.currentUserSubject.value?.funcao === 'OPERADOR';
  }

  // Getter síncrono para o perfil (MUITO útil)
  public getPerfilUsuario(): PerfilUsuario | null {
    return this.currentUserSubject.value;
  }
  // --- MODIFICAÇÃO TERMINA ---

  // Carrega o usuário do token E/OU localStorage
  loadInitialUser(): void {
    const token = this.getToken();
    const storedPerfil = localStorage.getItem('user_perfil');

    if (token) {
      if (storedPerfil) {
        // Se já tem no storage, usa
        this.currentUserSubject.next(JSON.parse(storedPerfil));
      } else {
        // Se não tem no storage mas tem token, busca na API
        this.usuarioService.getPerfil().subscribe({
          next: (perfil) => this.storePerfilUsuario(perfil), // Salva ao buscar
          error: () => this.logout() // Token expirado
        });
      }
    } else {
      this.currentUserSubject.next(null); // Limpa se não houver token
    }
  }

  login(usuario: string, senha: string): Observable<AuthResponse> {
    const loginUrl = `${this.apiUrl}/token/`;
    return this.http.post<AuthResponse>(loginUrl, { username: usuario, password: senha })
      .pipe(
        tap(response => {
          this.setSession(response);
          // Busca o perfil imediatamente após o login e salva
          this.usuarioService.getPerfil().subscribe(perfil => {
            this.storePerfilUsuario(perfil);
          });
        })
      );
  }

  private setSession(authResult: AuthResponse) {
    localStorage.setItem('access_token', authResult.access);
  }

  // --- MODIFICAÇÃO (Método novo) ---
  // Salva o perfil no localStorage E no BehaviorSubject
  storePerfilUsuario(perfil: PerfilUsuario) {
    localStorage.setItem('user_perfil', JSON.stringify(perfil));
    this.currentUserSubject.next(perfil);
  }
  // --- FIM DA MODIFICAÇÃO ---

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_perfil'); // <-- MODIFICAÇÃO
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}
