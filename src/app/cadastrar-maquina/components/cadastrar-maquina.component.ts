import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {MaquinaService} from '../../services/maquina';

@Component({
  selector: 'app-cadastrar-maquina',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './cadastrar-maquina.component.html',
  styleUrls: ['./cadastrar-maquina.component.css']
})
export class CadastrarMaquinaComponent {

  maquina: any = {
    nome: '',
    modelo: '',
    fabricante: '',
    ano: null,
    descricao: '',
    status: 'running' // Status padrão ao cadastrar
  };

  constructor(
    private router: Router,
    private maquinaService: MaquinaService
  ) { }

  onSubmit(): void {
    this.maquinaService.cadastrarMaquina(this.maquina).subscribe({
      next: (response) => {
        console.log('Máquina cadastrada com sucesso!', response);
        alert('Máquina cadastrada com sucesso!');
        this.router.navigate(['/home']); // Navega para a home após o sucesso
      },
      error: (err) => {
        console.error('Erro ao cadastrar máquina:', err);
        alert('Ocorreu um erro ao cadastrar a máquina. Verifique o console para mais detalhes.');
      }
    });
  }
}
