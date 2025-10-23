import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ConfiguracoesUsuario {
  notificacoesPorEmail: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConfiguracoesService {
  private apiUrl = 'http://localhost:8000/api/configuracoes/';

  constructor(private http: HttpClient) { }

  getConfiguracoes(): Observable<ConfiguracoesUsuario> {
    return this.http.get<ConfiguracoesUsuario>(this.apiUrl);
  }

  salvarConfiguracoes(config: ConfiguracoesUsuario): Observable<any> {
    return this.http.put(this.apiUrl, config);
  }
}
