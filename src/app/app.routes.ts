// ARQUIVO: src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/components/login.component';
import { HomeComponent } from './home/components/home.component';
import { CadastrarMaquinaComponent } from './cadastrar-maquina/components/cadastrar-maquina.component';
import { MachineDetails } from './machine-details/machine-details';
import { EditarPerfilComponent } from './paginas/editar-perfil/editar-perfil.component';
import { ConfiguracoesComponent } from './paginas/configuracoes/configuracoes.component';
import { AgendamentoComponent } from './agendamento/agendamento/agendamento.component';
import { GerenciarUsuariosComponent } from './paginas/gerenciar-usuarios/gerenciar-usuarios.component';
import { adminGuard } from './shared/admin.guard';
import { authGuard } from './shared/auth.guard';
import { ChecklistPreventivaComponent } from './formularios/checklist-preventiva/checklist-preventiva.component';

import { RelatoriosComponent } from './paginas/relatorios/relatorios.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'maquina/:id', component: MachineDetails, canActivate: [authGuard] },
  { path: 'agendamento', component: AgendamentoComponent, canActivate: [authGuard] },
  { path: 'cadastrar-maquina', component: CadastrarMaquinaComponent, canActivate: [authGuard] },
  { path: 'editar-perfil', component: EditarPerfilComponent, canActivate: [authGuard] },
  { path: 'configuracoes', component: ConfiguracoesComponent, canActivate: [authGuard] },
  {
    path: 'gerenciar-usuarios',
    component: GerenciarUsuariosComponent,
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'checklist-preventiva/:id',
    component: ChecklistPreventivaComponent,
    canActivate: [authGuard]
  },

  {
    path: 'relatorios',
    component: RelatoriosComponent,
    canActivate: [authGuard]
  },

];
