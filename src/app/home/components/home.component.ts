import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Maquina, MaquinaService } from '../../services/maquina.service';
import { AuthService } from '../../services/auth.service';

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
  isAdmin = false; // controla exibição de botões de admin

  constructor(
    private maquinaService: MaquinaService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarMaquinas();
    this.isAdmin = this.authService.isUserAdmin();
  }

  carregarMaquinas(): void {
    this.maquinaService.getMaquinas().subscribe({
      next: (data: Maquina[]) => {
        this.maquinas = data;
        console.log('Máquinas carregadas:', this.maquinas);
      },
      error: (err: any) => {
        console.error('Falha ao carregar máquinas:', err);
      }
    });
  }

  getStatusLabel(statusKey: any): string {
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
    this.router.navigate(['/login']);
    this.closeUserPopup();
  }
}
