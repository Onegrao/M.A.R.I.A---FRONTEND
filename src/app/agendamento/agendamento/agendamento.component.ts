import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Agendamento, AgendamentoService, NovoAgendamento } from '../../services/agendamento.service';
import { Maquina, MaquinaService } from '../../services/maquina.service';
import { Usuario, UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';

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
    private usuarioService: UsuarioService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const perfil = this.authService.getPerfilUsuario();
    if (perfil) {
      this.carregarDadosIniciais();
    } else {
      this.authService.currentUser$.subscribe(user => {
        if (user) {
          this.carregarDadosIniciais();
        }
      });
    }
  }

  carregarDadosIniciais(): void {
    this.carregarAgendamentos();
    if (this.authService.isGerente() || this.authService.isAdmin) {
      this.carregarMaquinas();
      this.carregarUsuarios();
    }
  }

  carregarAgendamentos(): void {
    this.agendamentoService.getAgendamentos('pendentes').subscribe({
      next: (data: Agendamento[]) => { this.agendamentosPendentes = data; },
      error: (err: HttpErrorResponse) => {
        if (err.status !== 403) {
          console.error("ERRO DETALHADO [Pendentes]:", err);
          alert('Erro ao carregar agendamentos pendentes.');
        } else {
          console.log("Usuário não tem permissão para listar todos os agendamentos (ou não tem nenhum).");
          this.agendamentosPendentes = [];
        }
      }
    });
  }

  carregarMaquinas(): void {
    this.maquinaService.getMaquinas().subscribe({
      next: (data: Maquina[]) => { this.maquinasDisponiveis = data; },
      error: (err: HttpErrorResponse) => {
        console.error("ERRO DETALHADO [Máquinas]:", err);
        alert('Erro ao carregar máquinas.');
      }
    });
  }

  carregarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.responsaveisDisponiveis = data.filter(u => u.funcao === 'TECNICO' || u.funcao === 'GERENTE' || u.is_staff);
      },
      error: (err: HttpErrorResponse) => {
        console.error("ERRO ao carregar usuários:", err.message);
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
      error: (err: HttpErrorResponse) => {
        console.error("ERRO DETALHADO [Salvar Agendamento]:", err);
        alert('Erro ao criar agendamento.');
      }
    });
  }

  iniciarManutencao(): void {
    const agendamentoParaIniciar = this.agendamentoSelecionado;
    if (!agendamentoParaIniciar) return;

    this.agendamentoService.iniciar(agendamentoParaIniciar.id).subscribe({
      next: () => {
        if (agendamentoParaIniciar.tipo_manutencao === 'Preventiva') {
          this.fecharModalDetalhes();
          this.router.navigate(['/checklist-preventiva', agendamentoParaIniciar.id]);
        } else {
          const index = this.agendamentosPendentes.findIndex(a => a.id === agendamentoParaIniciar.id);
          if (index !== -1) {
            this.agendamentosPendentes[index].status = 'em_andamento';
            this.agendamentosPendentes[index].status_display = 'Em Andamento';
          }
          alert('Manutenção (Corretiva/Preditiva) iniciada!');
          if (this.agendamentoSelecionado && this.agendamentoSelecionado.id === agendamentoParaIniciar.id) {
            this.agendamentoSelecionado.status = 'em_andamento';
            this.agendamentoSelecionado.status_display = 'Em Andamento';
          }
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error("ERRO DETALHADO [Iniciar Manutenção]:", err);
        alert('Erro ao iniciar manutenção.');
      }
    });
  }

  // A chamada para 'concluir' agora envia 'null' como o terceiro argumento
  concluirManutencao(): void {
    const idParaConcluir = this.agendamentoSelecionado?.id;
    if (!idParaConcluir) return;

    // Envia 'null' para 'dadosChecklist', pois não é um checklist
    this.agendamentoService.concluir(idParaConcluir, this.observacoesParaConclusao, null).subscribe({
      next: () => {
        this.agendamentosPendentes = this.agendamentosPendentes.filter(a => a.id !== idParaConcluir);
        alert('Manutenção concluída com sucesso!');
        this.fecharModalDetalhes();
      },
      error: (err: HttpErrorResponse) => {
        console.error("ERRO DETALHADO [Concluir Manutenção]:", err);
        alert('Erro ao concluir manutenção.');
      }
    });
  }

  cancelarManutencao(): void {
    const idParaCancelar = this.agendamentoSelecionado?.id;
    if (!idParaCancelar) return;
    if (!confirm('Tem certeza que deseja cancelar este agendamento?')) {
      return;
    }
    this.agendamentoService.cancelar(idParaCancelar).subscribe({
      next: () => {
        this.agendamentosPendentes = this.agendamentosPendentes.filter(a => a.id !== idParaCancelar);
        alert('Agendamento cancelado.');
        this.fecharModalDetalhes();
      },
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
      next: (data: Agendamento[]) => {
        this.historicoMaquinaSelecionada = data;
        this.isLoadingHistorico = false;
      },
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
