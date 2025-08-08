import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {MaquinaService} from '../../services/maquina.service';

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
    setor: '',
    cod_serie: null,
    funcao: '',
    marca: '',
    nome: '',
    apelido: '',
    data_entrada: '',
    status: null // Inicializado como nulo para o campo de seleção 'required'
  };

  constructor(
    private router: Router,
    private maquinaService: MaquinaService
  ) { }

  onSubmit(): void {
    this.maquinaService.cadastrarMaquina(this.maquina).subscribe({
      next: (response: any) => {
        console.log('Máquina cadastrada com sucesso!', response);
        alert('Máquina cadastrada com sucesso!');
        this.router.navigate(['/home']); // Navega para a home após o sucesso
      },
      error: (err: any) => {
        console.error('Erro ao cadastrar máquina:', err);
        const erroMsg = err.error?.cod_serie?.[0] || 'Ocorreu um erro ao cadastrar a máquina.';
        alert(erroMsg);
      }
    });
  }
}
