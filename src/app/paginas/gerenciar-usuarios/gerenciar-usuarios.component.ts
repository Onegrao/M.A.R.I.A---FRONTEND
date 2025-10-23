import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // FormsModule é necessário para o modal
import { Router, RouterModule } from '@angular/router';
import { UsuarioService, Usuario } from '../../services/usuario.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-gerenciar-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // FormsModule adicionado de volta
  templateUrl: './gerenciar-usuarios.component.html',
  styleUrls: ['./gerenciar-usuarios.component.css']
})
export class GerenciarUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];

  // Variáveis de estado para o Modal
  modalOpen = false;
  isEditMode = false;
  usuarioSelecionado: Partial<Usuario> = {};

  // Variáveis para Sidebar/Topbar
  sidebarOpen = false;
  userPopupOpen = false;

  constructor(
    private usuarioService: UsuarioService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error("Erro ao carregar usuários:", err);
        if (err.status !== 403) {
          alert('Falha ao carregar usuários.');
        }
      }
    });
  }

  // --- Métodos do Modal ---
  abrirModalNovo(): void {
    this.isEditMode = false;
    this.usuarioSelecionado = { is_staff: false }; // Novo usuário não é admin por padrão
    this.modalOpen = true;
  }

  abrirModalEditar(usuario: Usuario): void {
    this.isEditMode = true;
    // Cria uma cópia para não alterar a lista diretamente
    this.usuarioSelecionado = { ...usuario };
    // Limpa o campo senha (nunca exibimos hash)
    this.usuarioSelecionado.password = '';
    this.modalOpen = true;
  }

  fecharModal(): void {
    this.modalOpen = false;
    this.usuarioSelecionado = {}; // Limpa o formulário
  }

  salvarUsuario(): void {
    // Garante que is_staff seja booleano
    this.usuarioSelecionado.is_staff = !!this.usuarioSelecionado.is_staff;

    // Remove senha se vazia (só atualiza se algo for digitado)
    if (!this.usuarioSelecionado.password) {
      delete this.usuarioSelecionado.password;
    }

    const saveObservable = this.isEditMode
      ? this.usuarioService.updateUsuario(this.usuarioSelecionado.id!, this.usuarioSelecionado as Usuario)
      : this.usuarioService.createUsuario(this.usuarioSelecionado as Usuario);

    saveObservable.subscribe({
      next: (usuarioSalvo) => {
        alert(`Usuário ${this.isEditMode ? 'atualizado' : 'criado'} com sucesso!`);
        // Atualiza a lista local para feedback imediato
        if (this.isEditMode) {
          const index = this.usuarios.findIndex(u => u.id === usuarioSalvo.id);
          if (index !== -1) this.usuarios[index] = usuarioSalvo;
        } else {
          this.usuarios.push(usuarioSalvo);
        }
        this.fecharModal();
      },
      error: (err: HttpErrorResponse) => {
        console.error("Erro ao salvar:", err);
        alert(`Erro ao ${this.isEditMode ? 'atualizar' : 'criar'} usuário: ${err.error?.detail || err.message}`);
        // Não fecha o modal em caso de erro para o usuário corrigir
      }
    });
  }
  // --- Fim Métodos do Modal ---

  excluirUsuario(id: number): void {
    if (confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      this.usuarioService.deleteUsuario(id).subscribe({
        next: () => {
          this.usuarios = this.usuarios.filter(u => u.id !== id);
          alert('Usuário excluído com sucesso.');
        },
        error: (err: HttpErrorResponse) => {
          console.error("Erro ao excluir:", err);
          alert('Erro ao excluir usuário.');
        }
      });
    }
  }

  // Métodos da UI (Sidebar e Pop-up) - Padrão
  toggleSidebar(): void { this.sidebarOpen = !this.sidebarOpen; }
  openUserPopup(): void { this.userPopupOpen = true; }
  closeUserPopup(): void { this.userPopupOpen = false; }
  editarPerfil(): void { this.router.navigate(['/editar-perfil']); this.closeUserPopup(); }
  abrirConfiguracoes(): void { this.router.navigate(['/configuracoes']); this.closeUserPopup(); }
  logout(): void { this.authService.logout(); this.closeUserPopup(); }
}
