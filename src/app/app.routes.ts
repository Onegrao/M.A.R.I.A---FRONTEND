import { Routes } from '@angular/router';
import { LoginComponent } from './login/components/login.component';
import { HomeComponent } from './home/components/home.component';
import { CadastrarMaquinaComponent } from './cadastrar-maquina/components/cadastrar-maquina.component';
import { MachineDetails } from './machine-details/machine-details';
import {EditarPerfilComponent} from './paginas/editar-perfil/editar-perfil.component';
import { ConfiguracoesComponent } from './paginas/configuracoes/configuracoes.component';
import {GerenciarUsuariosComponent} from './paginas/gerenciar-usuarios/gerenciar-usuarios.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'maquina/:id', component: MachineDetails },
  { path: 'cadastrar-maquina', component: CadastrarMaquinaComponent },
  { path: 'editar-perfil', component: EditarPerfilComponent },
  { path: 'configuracoes', component: ConfiguracoesComponent },
  { path:  'admin/usuarios',component: GerenciarUsuariosComponent},
];
