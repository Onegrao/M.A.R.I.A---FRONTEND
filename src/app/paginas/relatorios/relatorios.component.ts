import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Agendamento, AgendamentoService } from '../../services/agendamento.service';
import { Maquina, MaquinaService } from '../../services/maquina.service';
import { Usuario, UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent implements OnInit {

  // --- Variáveis de Layout ---
  sidebarOpen = false;
  userPopupOpen = false;

  // --- Variáveis da Página ---
  historicoCompleto: Agendamento[] = [];
  historicoFiltrado: Agendamento[] = [];
  maquinasDisponiveis: Maquina[] = [];
  responsaveisDisponiveis: Usuario[] = [];
  filtros = {
    dataInicio: '', dataFim: '', maquinaId: '', responsavelId: '', tipo: ''
  };
  isLoading = true;

  // --- Variáveis para o Modal de Detalhes ---
  detalhesModalOpen = false;
  agendamentoSelecionado: Agendamento | null = null;

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

  // --- Lógica do Layout ---
  toggleSidebar(): void { this.sidebarOpen = !this.sidebarOpen; }
  openUserPopup(): void { this.userPopupOpen = true; }
  closeUserPopup(): void { this.userPopupOpen = false; }
  editarPerfil(): void {
    this.router.navigate(['/editar-perfil']);
    this.closeUserPopup();
  }
  abrirConfiguracoes(): void {
    this.router.navigate(['/configuracoes']);
    this.closeUserPopup();
  }
  logout(): void {
    this.authService.logout();
    this.closeUserPopup();
  }

  // --- Lógica da Página de Relatórios ---
  carregarDadosIniciais(): void {
    this.carregarHistorico();
    if (this.authService.isGerente() || this.authService.isAdmin) {
      this.carregarFiltrosDropdowns();
    }
  }

  carregarHistorico(): void {
    this.isLoading = true;
    this.agendamentoService.getAgendamentos('historico').subscribe({
      next: (data: Agendamento[]) => {
        this.historicoCompleto = data;
        this.historicoFiltrado = data;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error("Erro ao carregar histórico:", err);
        alert('Falha ao carregar o histórico de manutenções.');
        this.isLoading = false;
      }
    });
  }

  carregarFiltrosDropdowns(): void {
    this.maquinaService.getMaquinas().subscribe(data => {
      this.maquinasDisponiveis = data;
    });
    this.usuarioService.getUsuarios().subscribe(data => {
      this.responsaveisDisponiveis = data.filter(u =>
        u.funcao === 'TECNICO' || u.funcao === 'GERENTE' || u.is_staff
      );
    });
  }

  aplicarFiltros(): void {
    let resultado = [...this.historicoCompleto];
    if (this.filtros.dataInicio) {
      resultado = resultado.filter(a =>
        new Date(a.data_hora_execucao || '') >= new Date(this.filtros.dataInicio)
      );
    }
    if (this.filtros.dataFim) {
      const dataFim = new Date(this.filtros.dataFim);
      dataFim.setDate(dataFim.getDate() + 1);
      resultado = resultado.filter(a =>
        new Date(a.data_hora_execucao || '') < dataFim
      );
    }
    if (this.filtros.maquinaId) {
      resultado = resultado.filter(a => a.maquina === Number(this.filtros.maquinaId));
    }
    if (this.filtros.responsavelId && (this.authService.isGerente() || this.authService.isAdmin)) {
      resultado = resultado.filter(a => a.responsavel === Number(this.filtros.responsavelId));
    }
    if (this.filtros.tipo) {
      resultado = resultado.filter(a => a.tipo_manutencao === this.filtros.tipo);
    }
    this.historicoFiltrado = resultado;
  }

  limparFiltros(): void {
    this.filtros = {
      dataInicio: '', dataFim: '', maquinaId: '', responsavelId: '', tipo: ''
    };
    this.historicoFiltrado = [...this.historicoCompleto];
  }

  // Função para o botão principal (Exportar Lista)
  exportarPDFLista(): void {
    const doc = new jsPDF();
    const colunas: string[] = ['ID', 'Máquina'];
    const isGerenteOuAdmin = this.authService.isGerente() || this.authService.isAdmin;

    if (isGerenteOuAdmin) {
      colunas.push('Responsável');
    }
    colunas.push('Tipo', 'Data Conclusão', 'Status', 'Observações');

    const dados = this.historicoFiltrado.map(item => {
      const linha: any[] = [];
      linha.push(item.id);
      linha.push(item.maquina_nome || 'N/A');
      if (isGerenteOuAdmin) {
        linha.push(item.responsavel_nome || 'N/A');
      }
      linha.push(item.tipo_manutencao_display || 'N/A');
      linha.push(item.data_hora_execucao ?
        new Date(item.data_hora_execucao).toLocaleString('pt-BR', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit'
        }) : 'N/A'
      );
      linha.push(item.status_display || 'N/A');
      linha.push(item.observacoes_execucao || 'N/A');

      return linha;
    });

    doc.setFontSize(18);
    doc.text('Relatório de Histórico de Manutenções', 14, 22);

    autoTable(doc, {
      head: [colunas],
      body: dados,
      startY: 30,
      styles: { fontSize: 8, cellPadding: 2, },
      headStyles: { fillColor: [0, 156, 178] }
    });
    doc.save('relatorio_historico_MARIA.pdf');
  }

  // Funções para o Modal de Detalhes
  abrirDetalhes(item: Agendamento): void {
    this.agendamentoSelecionado = item;
    this.detalhesModalOpen = true;
  }

  fecharDetalhes(): void {
    this.detalhesModalOpen = false;
    this.agendamentoSelecionado = null;
  }

  private formatarData(data: string | undefined): string {
    if (!data) return 'N/A';
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  private desenharLinha(doc: jsPDF, posY: number, texto: string, valor: string) {
    doc.setFont('helvetica', 'bold');
    doc.text(texto, 15, posY);
    doc.setFont('helvetica', 'normal');
    doc.text(valor || 'N/A', 60, posY);
    return posY + 8;
  }

  private desenharCabecalhoSecao(doc: jsPDF, posY: number, texto: string) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setFillColor(230, 230, 230);
    doc.rect(15, posY - 5, 180, 8, 'F');
    doc.text(texto, 17, posY);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    return posY + 10;
  }

  // Função para o botão do Modal (Exportar Individual)
  exportarPDFIndividual(): void {
    const item = this.agendamentoSelecionado;
    if (!item) return;

    const dados = item.checklist_dados;
    const doc = new jsPDF();
    let posY = 20;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório de Manutenção', 105, posY, { align: 'center' });
    posY += 10;

    // Se não for checklist (Corretiva/Preditiva), PDF simples
    if (!dados) {
      doc.setFontSize(10);
      posY = this.desenharLinha(doc, posY, 'ID Registro:', String(item.id));
      posY = this.desenharLinha(doc, posY, 'Máquina:', item.maquina_nome || 'N/A');
      posY = this.desenharLinha(doc, posY, 'Tipo:', item.tipo_manutencao_display || 'N/A');
      posY = this.desenharLinha(doc, posY, 'Responsável:', item.responsavel_nome || 'N/A');
      posY = this.desenharLinha(doc, posY, 'Data Conclusão:', this.formatarData(item.data_hora_execucao));
      posY += 5;

      posY = this.desenharCabecalhoSecao(doc, posY, 'Diagnóstico (Parecer Técnico)');
      doc.setFont('helvetica', 'normal');
      const obsTexto = doc.splitTextToSize(item.observacoes_execucao || 'Nenhuma observação.', 180);
      doc.text(obsTexto, 17, posY);

      doc.save(`relatorio_id_${item.id}_${item.maquina_nome}.pdf`);
      return;
    }

    // --- Se for Preventiva, PDF do CHECKLIST ---
    doc.setFontSize(10);
    posY = this.desenharLinha(doc, posY, 'Máquina:', dados.maquina || 'N/A');
    posY = this.desenharLinha(doc, posY, 'Técnico:', dados.tecnico || 'N/A');
    posY = this.desenharLinha(doc, posY, 'Data:', new Date(dados.data_manutencao).toLocaleDateString('pt-BR'));
    posY = this.desenharLinha(doc, posY, 'Setor:', dados.setor || 'N/A');
    posY = this.desenharLinha(doc, posY, 'Nº Série:', dados.numero_serie || 'N/A');
    posY += 5;

    // Itens do Checklist
    posY = this.desenharCabecalhoSecao(doc, posY, 'Itens de Verificação');

    const desenharItemChecklist = (posY: number, label: string, valor: boolean) => {
      doc.setFont('helvetica', 'normal');
      doc.text(label, 17, posY);
      doc.setFont('helvetica', 'bold');
      const status = valor ? 'Conforme' : 'N/A';
      doc.setTextColor(valor ? '#0f5132' : '#6c757d');
      doc.text(status, 150, posY);
      doc.setTextColor(0, 0, 0);
      return posY + 8;
    };

    posY = desenharItemChecklist(posY, 'Verificação Visual', dados.item_verificacao_visual);
    posY = desenharItemChecklist(posY, 'Conferir Ruídos', dados.item_conferir_ruidos);
    posY = desenharItemChecklist(posY, 'Checar Limpeza', dados.item_checar_limpeza);
    posY = desenharItemChecklist(posY, 'Verificar conexões', dados.item_verificar_conexoes);
    posY = desenharItemChecklist(posY, 'Lubrificação de juntas', dados.item_lubrificacao_juntas);
    posY = desenharItemChecklist(posY, 'Verificar desgastes', dados.item_verificar_desgastes);
    posY = desenharItemChecklist(posY, 'Inspeção de cabos', dados.item_inspecao_cabos);
    posY = desenharItemChecklist(posY, 'Testar sensores', dados.item_testar_sensores);
    posY = desenharItemChecklist(posY, 'Teste completo da máquina', dados.item_teste_completo);
    posY += 5;

    // Diagnóstico (Observações)
    posY = this.desenharCabecalhoSecao(doc, posY, 'Diagnóstico (Parecer Técnico)');
    doc.setFont('helvetica', 'normal');
    // Usa o 'observacoes' do formulário se existir, senão o 'observacoes_execucao'
    const obsFinal = dados.observacoes || item.observacoes_execucao || 'Nenhuma observação.';
    const obsTexto = doc.splitTextToSize(obsFinal, 180);
    doc.text(obsTexto, 17, posY);

    doc.save(`checklist_id_${item.id}_${item.maquina_nome}.pdf`);
  }
}
