import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Maquina, MaquinaService } from '../../services/maquina.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ChatComponent } from '../../chat/chat/chat.component';
import { AuthService } from '../../services/auth.service'; // Necessário para o @if no HTML

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ChatComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  sidebarOpen = false;
  userPopupOpen = false;
  maquinas: Maquina[] = [];
  chatAberto = false;
  maquinaSelecionadaParaChat: Maquina | null = null;

  constructor(
    private maquinaService: MaquinaService,
    private router: Router,
    public authService: AuthService // Injetado e público para o HTML usar
  ) {}

  ngOnInit(): void {
    this.authService.loadInitialUser(); // Garante que saibamos se é admin
    this.carregarMaquinas();
  }

  carregarMaquinas(): void {
    this.maquinaService.getMaquinas().subscribe({
      next: (data: Maquina[]) => {
        this.maquinas = data;
        console.log('Máquinas carregadas:', this.maquinas);
      },
      error: (err: HttpErrorResponse) => { // Tipagem corrigida
        console.error('Falha ao carregar máquinas:', err);
      }
    });
  }

  abrirChat(maquina: Maquina): void {
    this.maquinaSelecionadaParaChat = maquina;
    this.chatAberto = true;
  }

  fecharChat(): void {
    this.chatAberto = false;
    this.maquinaSelecionadaParaChat = null;
  }

  getStatusLabel(statusKey: string): string { // Tipagem corrigida
    const labels: { [key: string]: string } = {
      'corretiva': 'Manutenção Corretiva',
      'preventiva': 'Realizar Preventiva',
      'desligada': 'Desligada'
    };
    return labels[statusKey] || 'Desconhecido';
  }

  toggleSidebar(): void { this.sidebarOpen = !this.sidebarOpen; }
  openUserPopup(): void { this.userPopupOpen = true; }
  closeUserPopup(): void { this.userPopupOpen = false; }

  editarPerfil(): void {
    this.router.navigate(['/editar-perfil']);
    this.closeUserPopup();
  }

  abrirConfiguracoes(): void {
    this.router.navigate(['/configuracoes']);
    this.closeUserPopup();
  }

  logout(): void {
    this.authService.logout(); // Corrigido para usar o AuthService
    this.closeUserPopup();
  }

  excluirMaquina(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta máquina?')) {
      this.maquinaService.deleteMaquina(id).subscribe({
        next: () => {
          alert('Máquina excluída com sucesso!');
          this.maquinas = this.maquinas.filter(m => m.id !== id);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao excluir máquina', err);
          alert('Não foi possível excluir a máquina.');
        }
      });
    }
  }
}
