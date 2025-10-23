import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService, ChatMessage } from '../../services/chatbot.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  // Recebe dados do componente que o chamou (o "pai")
  @Input() maquinaId!: number;
  @Input() nomeMaquina: string = 'Manual';

  mensagens: ChatMessage[] = [];
  novaMensagem: string = '';
  carregandoResposta: boolean = false;

  constructor(private chatbotService: ChatbotService) { }

  ngOnInit(): void {
    // Mensagem inicial de boas-vindas do bot
    this.mensagens.push({ sender: 'bot', text: `Olá! Como posso ajudar com o manual da ${this.nomeMaquina}?` });
  }

  enviarMensagem(): void {
    if (!this.novaMensagem.trim()) return;

    // Adiciona a mensagem do usuário à tela
    this.mensagens.push({ sender: 'user', text: this.novaMensagem });
    const pergunta = this.novaMensagem;
    this.novaMensagem = ''; // Limpa o campo de input
    this.carregandoResposta = true;

    // Envia a pergunta para o serviço e aguarda a resposta
    this.chatbotService.query(this.maquinaId, pergunta).subscribe({
      next: (response) => {
        // Adiciona a resposta do bot à tela
        this.mensagens.push({ sender: 'bot', text: response.resposta });
        this.carregandoResposta = false;
      },
      error: (err) => {
        console.error("Erro ao buscar resposta do chatbot:", err);
        this.mensagens.push({ sender: 'bot', text: 'Desculpe, ocorreu um erro. Tente novamente mais tarde.' });
        this.carregandoResposta = false;
      }
    });
  }
}
