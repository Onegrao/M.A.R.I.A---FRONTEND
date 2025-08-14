import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ConfiguracoesService, ConfiguracoesUsuario } from '../../services/configuracoes.service';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-configuracoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.css'],
})
export class ConfiguracoesComponent implements OnInit {
  config: ConfiguracoesUsuario = {
    notificacoesPorEmail: false,
    tema: 'Tema Claro'
  };

  constructor(
    private router: Router,
    private configService: ConfiguracoesService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.configService.getConfiguracoes().subscribe({
      next: data => {
        this.config = data;
        this.themeService.applyTheme(this.config.tema);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Falha ao carregar configurações', err);
      }
    });
  }

  salvarConfiguracoes(): void {
    this.configService.salvarConfiguracoes(this.config).subscribe({
      next: () => {
        console.log('Configurações salvas!');
        this.themeService.applyTheme(this.config.tema);
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
