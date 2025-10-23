import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ConfiguracoesService, ConfiguracoesUsuario } from '../../services/configuracoes.service'; // MANTIDO
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.css'],
})
export class ConfiguracoesComponent implements OnInit {

  config: Partial<ConfiguracoesUsuario> = {
    notificacoesPorEmail: false
  };

  constructor(
    private router: Router,
    private configService: ConfiguracoesService,
  ) {}

  ngOnInit(): void {
    this.configService.getConfiguracoes().subscribe({
      next: data => {
        this.config = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Falha ao carregar configurações', err);
      }
    });
  }

  salvarConfiguracoes(): void {
    this.configService.salvarConfiguracoes(this.config as ConfiguracoesUsuario).subscribe({
      next: () => {
        console.log('Configurações salvas!');
      },
      error: (err: HttpErrorResponse) => console.error('Erro ao salvar', err)
    });
  }

  toggleNotificacoes(): void {
    this.config.notificacoesPorEmail = !this.config.notificacoesPorEmail;
    this.salvarConfiguracoes();
  }

  voltar(): void {
    this.router.navigate(['/home']);
  }
}
