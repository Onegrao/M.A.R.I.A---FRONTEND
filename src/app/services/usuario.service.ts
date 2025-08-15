import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

export interface UsuarioParaAdmin {
  id?: number;
  username: string;
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  cargo?: string;
  empresa?: string;
}

@Injectable({
  providedIn: 'root'
})
// serviço para admin criar/excluir usuários
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/api/Usuarios/`;

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<UsuarioParaAdmin[]> {
    return this.http.get<UsuarioParaAdmin[]>(this.apiUrl);
  }

  criarUsuario(usuario: UsuarioParaAdmin): Observable<UsuarioParaAdmin> {
    return this.http.post<UsuarioParaAdmin>(this.apiUrl, usuario);
  }

  excluirUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
