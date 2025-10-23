import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService, PerfilUsuario } from '../../services/usuario.service';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css']
})
export class EditarPerfilComponent implements OnInit {
  perfil: Partial<PerfilUsuario> = {};

  constructor(
    private router: Router,
    // 2. Injetar o UsuarioService
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    // 3. Chamar o getPerfil do UsuarioService
    this.usuarioService.getPerfil().subscribe(data => {
      this.perfil = data;
    });
  }

  salvarPerfil(): void {
    // 4. Chamar o updatePerfil do UsuarioService
    //    (O método para salvar chama-se 'updatePerfil' no service)
    this.usuarioService.updatePerfil(this.perfil as PerfilUsuario).subscribe(() => {
      alert('Perfil salvo com sucesso!');
      this.router.navigate(['/home']);
    });
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
