import { Routes } from '@angular/router';
import { LoginComponent } from './login/components/login.component';
import { HomeComponent } from './home/components/home.component';
import { CadastrarMaquinaComponent } from './cadastrar-maquina/components/cadastrar-maquina.component';
import { MachineDetails } from './machine-details/machine-details'; // Verifique se este caminho está 100% correto
import { EditarPerfilComponent } from './paginas/editar-perfil/editar-perfil.component';
import { ConfiguracoesComponent } from './paginas/configuracoes/configuracoes.component';
import { AgendamentoComponent } from './agendamento/agendamento/agendamento.component';

// Importações para a rota de Gerenciar Usuários
import { GerenciarUsuariosComponent } from './paginas/gerenciar-usuarios/gerenciar-usuarios.component';
import { adminGuard } from './shared/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'maquina/:id', component: MachineDetails }, // Rota descomentada
  { path: 'agendamento', component: AgendamentoComponent },
  { path: 'cadastrar-maquina', component: CadastrarMaquinaComponent },
  { path: 'editar-perfil', component: EditarPerfilComponent },
  { path: 'configuracoes', component: ConfiguracoesComponent },

  // Nova rota para Gerenciar Usuários (protegida)
  {
    path: 'gerenciar-usuarios',
    component: GerenciarUsuariosComponent,
    canActivate: [adminGuard]
  },

  // (Opcional) Rota Curinga
  // { path: '**', redirectTo: 'home' }
];
