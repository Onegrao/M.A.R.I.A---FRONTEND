import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

// Interface para dados gerenciados pelo Admin
export interface Usuario {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_staff?: boolean;
  cargo?: string;
  empresa?: string;
  telefone?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  password?: string; // Apenas para criar/atualizar
}

// Interface para o próprio usuário editar
export interface PerfilUsuario {
  id: number;
  nome: string; // Vem de first_name no backend
  email: string;
  cargo?: string; // Readonly
  empresa?: string;
  telefone?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  is_staff?: boolean; // Readonly
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // --- Rotas de Admin ---
  getUsuarios(): Observable<Usuario[]> {
    // A URL base agora é minúscula, conforme corrigimos no urls.py
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios/`);
  }

  createUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios/`, usuario);
  }

  updateUsuario(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/usuarios/${id}/`, usuario);
  }

  deleteUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/usuarios/${id}/`);
  }

  // --- Rotas de Perfil (usuário normal) ---
  getPerfil(): Observable<PerfilUsuario> {
    // A action 'perfil' foi movida para dentro do UsuarioViewSet
    return this.http.get<PerfilUsuario>(`${this.apiUrl}/usuarios/perfil/`);
  }

  updatePerfil(perfilData: PerfilUsuario): Observable<PerfilUsuario> {
    // Usar PATCH é melhor para atualizações parciais
    return this.http.patch<PerfilUsuario>(`${this.apiUrl}/usuarios/perfil/`, perfilData);
  }
}
