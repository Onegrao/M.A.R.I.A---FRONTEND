import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {

  sidebarOpen = false;


  userPopupOpen = false;


  constructor() {}


  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }



  openUserPopup(): void {
    this.userPopupOpen = true;
  }


  closeUserPopup(): void {
    this.userPopupOpen = false;
  }


  editProfile(): void {
    console.log('Navegando para a página de editar perfil...');
    this.closeUserPopup(); // Fecha o popup
  }


  openSettings(): void {
    console.log('Abrindo a tela de configurações...');
    this.closeUserPopup(); // Fecha o popup
  }


  logout(): void {
    console.log('Usuário deslogado.');
    this.closeUserPopup();
  }
}
