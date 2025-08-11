import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Maquina {
  id?: number;
  nome: string;
  apelido?: string;
  status: 'corretiva' | 'preventiva' | 'desligada';
  setor: string;
  cod_serie: number;
  funcao: string;
  marca: string;
  data_entrada: string;
}


@Injectable({
  providedIn: 'root'
})
export class MaquinaService {

  private apiUrl = 'http://127.0.0.1:8000/api/maquinas/';

  constructor(private http: HttpClient) { }


  getMaquinas(): Observable<Maquina[]> {
    return this.http.get<Maquina[]>(this.apiUrl);
  }


  getMaquinaById(id: number): Observable<Maquina> {
    return this.http.get<Maquina>(`${this.apiUrl}${id}/`);
  }


  cadastrarMaquina(maquina: Maquina): Observable<Maquina> {
    return this.http.post<Maquina>(this.apiUrl, maquina);
  }


  updateMaquina(id: number, maquina: Maquina): Observable<Maquina> {
    return this.http.put<Maquina>(`${this.apiUrl}${id}/`, maquina);
  }


  deleteMaquina(id: number): Observable<void> {

    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}
