import { Component, OnInit } from '@angular/core'; // <-- Importe OnInit
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {MaquinaService} from '../../services/maquina';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  sidebarOpen = false;
  userPopupOpen = false;

  maquinas: any[] = [];

  constructor(private maquinaService: MaquinaService) {}

  ngOnInit(): void {
    this.carregarMaquinas();
  }

  // MÉTODO PARA BUSCAR OS DADOS USANDO O SERVIÇO
  carregarMaquinas(): void {
    this.maquinaService.getMaquinas().subscribe({
      next: (data) => {
        this.maquinas = data; // Preenche a lista com os dados da API
        console.log('Máquinas carregadas:', this.maquinas);
      },
      error: (err) => {
        console.error('Falha ao carregar máquinas:', err);
      }
    });
  }

  // Função auxiliar para o template exibir o nome do status corretamente
  getStatusLabel(statusKey: string): string {
    const labels: { [key: string]: string } = {
      'running': 'Running',
      'preventiva': 'Realizar preventiva',
      'perigo': 'Perigo'
    };
    return labels[statusKey] || 'Desconhecido';
  }

  toggleSidebar(): void { this.sidebarOpen = !this.sidebarOpen; }
  openUserPopup(): void { this.userPopupOpen = true; }
  closeUserPopup(): void { this.userPopupOpen = false; }
  editProfile(): void { console.log('Navegando para a página de editar perfil...'); this.closeUserPopup(); }
  openSettings(): void { console.log('Abrindo a tela de configurações...'); this.closeUserPopup(); }
  logout(): void { console.log('Usuário deslogado.'); this.closeUserPopup(); }
}
