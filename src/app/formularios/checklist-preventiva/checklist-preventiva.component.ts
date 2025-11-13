
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Agendamento, AgendamentoService } from '../../services/agendamento.service';

@Component({
  selector: 'app-checklist-preventiva',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './checklist-preventiva.component.html',
  styleUrls: ['./checklist-preventiva.component.css']
})
export class ChecklistPreventivaComponent implements OnInit {

  preventiveForm!: FormGroup;
  agendamentoId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private agendamentoService: AgendamentoService
  ) {}

  ngOnInit(): void {
    this.agendamentoId = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(this.agendamentoId) || this.agendamentoId === 0) {
      alert('ID de agendamento inválido!');
      this.router.navigate(['/agendamento']);
      return;
    }
    this.preventiveForm = this.fb.group({
      maquina: [{ value: '', disabled: true }],
      tecnico: [{ value: '', disabled: true }],
      data_manutencao: [new Date().toISOString().split('T')[0], Validators.required],
      setor: ['', Validators.required],
      numero_serie: ['', Validators.required],
      item_verificacao_visual: [false, Validators.requiredTrue],
      item_conferir_ruidos: [false, Validators.requiredTrue],
      item_checar_limpeza: [false, Validators.requiredTrue],
      item_verificar_conexoes: [false, Validators.requiredTrue],
      item_lubrificacao_juntas: [false, Validators.requiredTrue],
      item_verificar_desgastes: [false, Validators.requiredTrue],
      item_inspecao_cabos: [false, Validators.requiredTrue],
      item_testar_sensores: [false, Validators.requiredTrue],
      item_teste_completo: [false, Validators.requiredTrue],
      observacoes: ['']
    });
    this.carregarDadosAgendamento();
  }

  carregarDadosAgendamento(): void {
    this.agendamentoService.getAgendamentoById(this.agendamentoId).subscribe({
      next: (data: Agendamento) => {
        this.preventiveForm.patchValue({
          maquina: data.maquina_nome,
          tecnico: data.responsavel_nome
        });
      },
      error: (err: HttpErrorResponse) => {
        alert('Erro ao carregar dados do agendamento.');
        console.error(err);
        this.router.navigate(['/agendamento']);
      }
    });
  }

  // A chamada para 'concluir' agora envia os 3 argumentos
  onSubmit(): void {
    if (this.preventiveForm.invalid) {
      alert('Por favor, marque todos os itens do checklist e preencha os dados.');
      this.preventiveForm.markAllAsTouched();
      return;
    }

    const observacoes = this.preventiveForm.get('observacoes')?.value || '';

    // Pega TODOS os dados do formulário (incluindo desabilitados e checkboxes)
    const dadosChecklist = this.preventiveForm.getRawValue();

    // Envia o ID, as observações E o JSON completo do checklist
    this.agendamentoService.concluir(this.agendamentoId, observacoes, dadosChecklist).subscribe({
      next: () => {
        alert('Checklist de Preventiva concluído com sucesso!');
        this.router.navigate(['/agendamento']);
      },
      error: (err: HttpErrorResponse) => {
        console.error("Erro ao concluir checklist:", err);
        alert('Erro ao enviar checklist.');
      }
    });
  }

  onImprimir(): void {
    window.print();
  }

  onCancelar(): void {
    if(confirm('Tem certeza que deseja cancelar? O status da manutenção não será alterado.')) {
      this.router.navigate(['/agendamento']);
    }
  }
}
