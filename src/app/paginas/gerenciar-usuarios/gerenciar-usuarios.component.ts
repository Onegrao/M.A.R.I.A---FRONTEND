import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService, UsuarioParaAdmin } from '../../services/usuario.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-gerenciar-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gerenciar-usuarios.component.html',
  styleUrls: ['./gerenciar-usuarios.component.css']
})
export class GerenciarUsuariosComponent implements OnInit {

  usuarios: UsuarioParaAdmin[] = [];

  novoUsuario: UsuarioParaAdmin = { username: '', email: '', password: '', first_name: '' };

  mostrarFormulario = false;

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Falha ao carregar usuários:', err);
        alert('Você não tem permissão para ver esta página ou ocorreu um erro.');
      }
    });
  }

  iniciarCadastro(): void {
    this.mostrarFormulario = true;
    this.novoUsuario = { username: '', email: '', password: '', first_name: '' };
  }

  cancelarCadastro(): void {
    this.mostrarFormulario = false;
  }

  cadastrarUsuario(): void {
    this.usuarioService.criarUsuario(this.novoUsuario).subscribe({
      next: () => {
        alert('Usuário cadastrado com sucesso!');
        this.mostrarFormulario = false;
        this.carregarUsuarios();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Falha ao cadastrar usuário:', err);
        alert('Erro ao cadastrar usuário. Verifique os dados e tente novamente.');
      }
    });
  }

  excluirUsuario(id: number | undefined): void {
    if (id === undefined) {
      console.error('Tentativa de excluir usuário sem ID.');
      return;
    }

    if (confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      this.usuarioService.excluirUsuario(id).subscribe({
        next: () => {
          alert('Usuário excluído com sucesso!');
          this.carregarUsuarios();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Falha ao excluir usuário:', err);
          alert('Erro ao excluir usuário.');
        }
      });
    }
  }
}
