import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
    descricao: ''
  };

  constructor(private router: Router) { }

  onSubmit(): void {
    console.log('Máquina cadastrada:', this.maquina);
    alert('Máquina cadastrada com sucesso!');
    this.router.navigate(['/home']);
  }
}
