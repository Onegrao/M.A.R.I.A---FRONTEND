import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// 1. Importar o HttpErrorResponse
import { HttpErrorResponse } from '@angular/common/http';
import { Agendamento, AgendamentoService, NovoAgendamento } from '../../services/agendamento.service';
import { Maquina, MaquinaService } from '../../services/maquina.service';
import { Usuario, UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './agendamento.component.html',
  styleUrls: ['./agendamento.component.css', './kanban.css']
})
export class AgendamentoComponent implements OnInit {
  sidebarOpen = false;
  novoAgendamentoModalOpen = false;
  detalhesModalOpen = false;
  historicoModalOpen = false;

  agendamentosPendentes: Agendamento[] = [];
  historicoMaquinaSelecionada: Agendamento[] = [];
  maquinasDisponiveis: Maquina[] = [];
  responsaveisDisponiveis: Usuario[] = [];

  novoAgendamento: Partial<NovoAgendamento> = { tipo_manutencao: 'Preventiva' };
  agendamentoSelecionado: Agendamento | null = null;
  observacoesParaConclusao: string = '';

  nomeMaquinaHistorico: string = '';
  isLoadingHistorico: boolean = false;

  statusFilter: string = '';

  constructor(
    private agendamentoService: AgendamentoService,
    private maquinaService: MaquinaService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.carregarDadosIniciais();
  }

  carregarDadosIniciais(): void {
    this.carregarAgendamentos();
    this.carregarMaquinas();
    this.carregarUsuarios();
  }

  carregarAgendamentos(): void {
    this.agendamentoService.getAgendamentos('pendentes').subscribe({
      // 2. Adicionar tipo
      next: (data: Agendamento[]) => {
        this.agendamentosPendentes = data;
      },
      // 3. Adicionar tipo
      error: (err: HttpErrorResponse) => {
        console.error("ERRO DETALHADO [Pendentes]:", err);
        alert('Erro ao carregar agendamentos pendentes.');
      }
    });
  }

  carregarMaquinas(): void {
    this.maquinaService.getMaquinas().subscribe({
      // 4. Adicionar tipo
      next: (data: Maquina[]) => {
        this.maquinasDisponiveis = data;
      },
      // 5. Adicionar tipo
      error: (err: HttpErrorResponse) => {
        console.error("ERRO DETALHADO [Máquinas]:", err);
        alert('Erro ao carregar máquinas.');
      }
    });
  }

  carregarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      // 6. Adicionar tipo
      next: (data: Usuario[]) => {
        this.responsaveisDisponiveis = data;
      },
      // 7. Adicionar tipo
      error: (err: HttpErrorResponse) => {
        console.error("ERRO DETALHADO [Usuários]:", err);
        alert('Erro ao carregar usuários.');
      }
    });
  }

  get agendamentosFiltrados(): Agendamento[] {
    if (!this.statusFilter) {
      return this.agendamentosPendentes;
    }
    return this.agendamentosPendentes.filter(a => a.status === this.statusFilter);
  }

  salvarAgendamento(): void {
    if (!this.novoAgendamento.maquina || !this.novoAgendamento.responsavel || !this.novoAgendamento.data_hora_agendada) {
      alert('Preencha os campos obrigatórios: Máquina, Responsável e Data.');
      return;
    }

    this.agendamentoService.criarAgendamento(this.novoAgendamento as NovoAgendamento).subscribe({
      next: () => {
        this.carregarAgendamentos();
        alert('Agendamento criado com sucesso!');
        this.fecharModalNovoAgendamento();
      },
      // 8. Adicionar tipo
      error: (err: HttpErrorResponse) => {
        console.error("ERRO DETALHADO [Salvar Agendamento]:", err);
        alert('Erro ao criar agendamento.');
      }
    });
  }

  iniciarManutencao(): void {
    if (!this.agendamentoSelecionado) return;

    this.agendamentoService.iniciar(this.agendamentoSelecionado.id).subscribe({
      next: () => {
        const index = this.agendamentosPendentes.findIndex(a => a.id === this.agendamentoSelecionado!.id);
        if (index !== -1) {
          this.agendamentosPendentes[index].status = 'em_andamento';
          this.agendamentosPendentes[index].status_display = 'Em Andamento';
        }
        alert('Manutenção iniciada!');
        this.fecharModalDetalhes();
      },
      // 9. Adicionar tipo
      error: (err: HttpErrorResponse) => {
        console.error("ERRO DETALHADO [Iniciar Manutenção]:", err);
        alert('Erro ao iniciar manutenção.');
      }
    });
  }

  concluirManutencao(): void {
    if (!this.agendamentoSelecionado) return;

    this.agendamentoService.concluir(this.agendamentoSelecionado.id, this.observacoesParaConclusao).subscribe({
      next: () => {
        this.agendamentosPendentes = this.agendamentosPendentes.filter(a => a.id !== this.agendamentoSelecionado!.id);
        alert('Manutenção concluída com sucesso!');
        this.fecharModalDetalhes();
      },
      // 10. Adicionar tipo
      error: (err: HttpErrorResponse) => {
        console.error("ERRO DETALHADO [Concluir Manutenção]:", err);
        alert('Erro ao concluir manutenção.');
      }
    });
  }

  cancelarManutencao(): void {
    if (!this.agendamentoSelecionado) return;

    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) {
      return;
    }

    this.agendamentoService.cancelar(this.agendamentoSelecionado.id).subscribe({
      next: () => {
        this.agendamentosPendentes = this.agendamentosPendentes.filter(a => a.id !== this.agendamentoSelecionado!.id);
        alert('Agendamento cancelado.');
        this.fecharModalDetalhes();
      },
      // 11. Adicionar tipo
      error: (err: HttpErrorResponse) => {
        console.error("ERRO DETALHADO [Cancelar Manutenção]:", err);
        alert('Erro ao cancelar agendamento.');
      }
    });
  }

  abrirModalNovoAgendamento(): void {
    this.novoAgendamento = { tipo_manutencao: 'Preventiva' };
    this.novoAgendamentoModalOpen = true;
  }

  fecharModalNovoAgendamento(): void {
    this.novoAgendamentoModalOpen = false;
  }

  abrirModalDetalhes(agendamento: Agendamento): void {
    this.agendamentoSelecionado = { ...agendamento };
    this.observacoesParaConclusao = agendamento.observacoes_execucao || '';
    this.detalhesModalOpen = true;
  }

  fecharModalDetalhes(): void {
    this.detalhesModalOpen = false;
    this.agendamentoSelecionado = null;
    this.observacoesParaConclusao = '';
  }

  abrirModalHistorico(agendamento: Agendamento): void {
    this.isLoadingHistorico = true;
    this.historicoMaquinaSelecionada = [];
    this.nomeMaquinaHistorico = agendamento.maquina_nome || 'Máquina';
    this.historicoModalOpen = true;

    const maquinaId = agendamento.maquina;

    this.agendamentoService.getAgendamentos('historico', maquinaId).subscribe({
      // 12. Adicionar tipo
      next: (data: Agendamento[]) => {
        this.historicoMaquinaSelecionada = data;
        this.isLoadingHistorico = false;
      },
      // 13. Adicionar tipo
      error: (err: HttpErrorResponse) => {
        console.error("ERRO DETALHADO [Histórico Máquina]:", err);
        alert('Erro ao carregar histórico da máquina.');
        this.isLoadingHistorico = false;
      }
    });
  }

  fecharModalHistorico(): void {
    this.historicoModalOpen = false;
    this.historicoMaquinaSelecionada = [];
    this.nomeMaquinaHistorico = '';
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
