import { Routes } from '@angular/router';
import { LoginComponent } from './login/components/login.component';
import { HomeComponent } from './home/components/home.component';
import { CadastrarMaquinaComponent } from './cadastrar-maquina/components/cadastrar-maquina.component';
import { MachineDetails } from './machine-details/machine-details';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'maquina/:id', component: MachineDetails },
  { path: 'cadastrar-maquina', component: CadastrarMaquinaComponent },
];
