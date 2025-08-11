import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Maquina, MaquinaService } from '../../services/maquina.service';

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

  public maquina: Maquina = {
    nome: '',
    setor: '',
    cod_serie: 0,
    funcao: '',
    marca: '',
    apelido: '',
    data_entrada: '',
    status: 'desligada'
  };

  constructor(
    private router: Router,
    private maquinaService: MaquinaService
  ) { }

  onSubmit(): void {
    // Garante que o cod_serie é enviado como número
    this.maquina.cod_serie = Number(this.maquina.cod_serie);

    this.maquinaService.cadastrarMaquina(this.maquina).subscribe({
      next: (response) => {
        console.log('Máquina cadastrada com sucesso!', response);
        alert('Máquina cadastrada com sucesso!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Erro ao cadastrar máquina:', err);
        const erroMsg = err.error?.cod_serie?.[0] || 'Ocorreu um erro ao cadastrar a máquina.';
        alert(erroMsg);
      }
    });
  }
}
