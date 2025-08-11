import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Maquina {
  id?: number;
  setor: string;
  cod_serie: string;
  funcao: string;
  marca: string;
  nome: string;
  apelido: string;
  data_entrada: string;
  status: any; 
}


@Injectable({
  providedIn: 'root'
})
export class MaquinaService {

  
  private apiUrl = 'http://sua-api-aqui.com/api/maquinas';

  constructor(private http: HttpClient) { }

  
  getMaquinas(): Observable<Maquina[]> {
    // Faz uma requisição HTTP GET para a sua API.
    return this.http.get<Maquina[]>(this.apiUrl);
  }

 
  cadastrarMaquina(maquina: Maquina): Observable<Maquina> {
    return this.http.post<Maquina>(this.apiUrl, maquina);
  }


}
