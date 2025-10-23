import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define uma estrutura para as mensagens do chat
export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

// Define a estrutura da resposta da API
export interface BotResponse {
  resposta: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  // Endereço da sua API FastAPI que está rodando localmente
  private apiUrl = 'http://127.0.0.1:8001';

  constructor(private http: HttpClient) { }

  /**
   * Envia uma pergunta para a API do chatbot e retorna a resposta.
   * @param maquinaId O ID da máquina para filtrar o manual correto.
   * @param pergunta A pergunta do usuário.
   */
  query(maquinaId: number, pergunta: string): Observable<BotResponse> {
    const body = {
      maquina_id: maquinaId,
      pergunta: pergunta
    };
    return this.http.post<BotResponse>(`${this.apiUrl}/query/`, body);
  }
}
