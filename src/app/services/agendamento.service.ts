import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

export interface Agendamento {
  id: number;
  maquina: number;
  responsavel: number;
  data_hora_agendada: string;
  tipo_manutencao: string;
  status: string;
  observacoes_execucao?: string;
  data_hora_execucao?: string;
  maquina_nome?: string;
  responsavel_nome?: string;
  status_display?: string;
  tipo_manutencao_display?: string;
  descricao_agendamento?: string;
}

export interface NovoAgendamento {
  maquina: number;
  responsavel: number;
  data_hora_agendada: string;
  tipo_manutencao: string;
  descricao_agendamento?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {

  private apiUrl = `${environment.apiUrl}/agendamentos/`;
  constructor(private http: HttpClient) {}

  getAgendamentos(tipo: 'pendentes' | 'historico', maquinaId?: number): Observable<Agendamento[]> {

    let params = new HttpParams().set('lista', tipo);
    if (maquinaId) {
      params = params.append('maquina_id', maquinaId.toString());
    }

    return this.http.get<Agendamento[]>(this.apiUrl, { params: params });
  }

  criarAgendamento(agendamento: NovoAgendamento): Observable<Agendamento> {
    return this.http.post<Agendamento>(this.apiUrl, agendamento);
  }

  concluir(id: number, observacoes: string): Observable<Agendamento> {
    const payload = { observacoes_execucao: observacoes };
    return this.http.post<Agendamento>(`${this.apiUrl}${id}/concluir/`, payload);
  }

  cancelar(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}${id}/cancelar/`, {});
  }

  iniciar(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}${id}/iniciar/`, {});
  }

  deleteAgendamento(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}
