import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface para definir a estrutura de dados de uma Máquina
export interface Maquina {
  id?: number;
  setor: string;
  cod_serie: string;
  funcao: string;
  marca: string;
  nome: string;
  apelido: string;
  data_entrada: string;
  status: any; // Pode ser string como 'running', 'perigo', ou boolean. Ajuste conforme sua API.
}


@Injectable({
  providedIn: 'root'
})
export class MaquinaService {

  // !!! IMPORTANTE !!!
  // Verifique se esta é a URL correta do seu backend (API)
  private apiUrl = 'http://sua-api-aqui.com/api/maquinas';

  constructor(private http: HttpClient) { }

  /**
   * BUSCA A LISTA DE TODAS AS MÁQUINAS NA API.
   * Este é o método que faltava para o seu HomeComponent.
   * @returns Um Observable com um array de máquinas.
   */
  getMaquinas(): Observable<Maquina[]> {
    // Faz uma requisição HTTP GET para a sua API.
    return this.http.get<Maquina[]>(this.apiUrl);
  }

  /**
   * Envia os dados da nova máquina para serem cadastrados no backend.
   * @param maquina O objeto contendo os dados da máquina a ser cadastrada.
   * @returns Um Observable com a resposta da API.
   */
  cadastrarMaquina(maquina: Maquina): Observable<Maquina> {
    // Faz uma requisição HTTP POST para cadastrar uma nova máquina.
    return this.http.post<Maquina>(this.apiUrl, maquina);
  }


}
