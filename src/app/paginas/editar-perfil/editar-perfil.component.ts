import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PerfilService, PerfilUsuario } from '../../services/perfil.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css']
})
export class EditarPerfilComponent implements OnInit {
  // Objeto para guardar os dados do formulário
  perfil: Partial<PerfilUsuario> = {};

  constructor(
    private router: Router,
    private perfilService: PerfilService
  ) {}

  ngOnInit(): void {
    // Carrega os dados do usuário quando a página inicia
    this.perfilService.getPerfil().subscribe(data => {
      this.perfil = data;
    });
  }

  salvarPerfil(): void {
    this.perfilService.salvarPerfil(this.perfil).subscribe(() => {
      alert('Perfil salvo com sucesso!');
      this.router.navigate(['/home']);
    });
  }

  cancelar(): void {
    this.router.navigate(['/home']);
  }
}
