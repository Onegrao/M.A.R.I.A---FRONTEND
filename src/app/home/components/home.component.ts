import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Maquina, MaquinaService } from '../../services/maquina.service';
import { HttpErrorResponse } from '@angular/common/http';

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

  maquinas: Maquina[] = [];

  constructor(private maquinaService: MaquinaService) {}

  ngOnInit(): void {
    this.carregarMaquinas();
  }

  // MÉTODO PARA BUSCAR OS DADOS USANDO O SERVIÇO
  carregarMaquinas(): void {
    this.maquinaService.getMaquinas().subscribe({
      next: (data: Maquina[]) => {
        this.maquinas = data; // Preenche a lista com os dados da API
        console.log('Máquinas carregadas:', this.maquinas);
      },
      error: (err: any) => {
        console.error('Falha ao carregar máquinas:', err);
      }
    });
  }

  getStatusLabel(statusKey: any): string {
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
