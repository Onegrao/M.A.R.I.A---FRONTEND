import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PerfilUsuario {
  id: number;
  nome: string;
  email: string;
  cargo: string;
  empresa: string;
  telefone?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private apiUrl = 'http://localhost:8000/api/perfil/';

  constructor(private http: HttpClient) { }

  getPerfil(): Observable<PerfilUsuario> {
    return this.http.get<PerfilUsuario>(this.apiUrl);
  }

  salvarPerfil(perfil: Partial<PerfilUsuario>): Observable<any> {
    // PATCH vai enviar apenas os campos alterados
    return this.http.patch(this.apiUrl, perfil);
  }
}
