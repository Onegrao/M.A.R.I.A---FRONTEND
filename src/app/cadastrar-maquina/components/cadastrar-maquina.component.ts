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

  // Variável para armazenar o arquivo PDF selecionado pelo usuário
  private selectedFile: File | null = null;

  constructor(
    private router: Router,
    private maquinaService: MaquinaService
  ) { }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {

    const formData = new FormData();

    formData.append('nome', this.maquina.nome);
    formData.append('setor', this.maquina.setor);
    formData.append('cod_serie', String(this.maquina.cod_serie)); // Converte número para string
    formData.append('funcao', this.maquina.funcao);
    formData.append('marca', this.maquina.marca);
    formData.append('apelido', this.maquina.apelido || ''); // Garante que não envie 'null'
    formData.append('data_entrada', this.maquina.data_entrada);
    formData.append('status', this.maquina.status);

    if (this.selectedFile) {
      formData.append('manual_pdf', this.selectedFile, this.selectedFile.name);
    }

    this.maquinaService.cadastrarMaquina(formData).subscribe({
      next: (response) => {
        console.log('Máquina cadastrada com sucesso!', response);
        // Verifica se a resposta contém um aviso do backend (status 207)
        if (response.detail) {
          alert(response.detail);
        } else {
          alert('Máquina e manual cadastrados com sucesso!');
        }
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
