import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usuario = '';
  senha = '';
  erroLogin = '';
  showNotification = false;

  constructor(private router: Router) {}

  fazerLogin() {
    if (this.usuario === 'admin@teste.com' && this.senha === '123456') {
      this.erroLogin = '';
      this.showNotification = false;
      this.router.navigate(['/home']);
    } else {
      this.erroLogin = 'Usuário ou senha incorretos.';
      this.showNotification = true;
      setTimeout(() => {
        this.showNotification = false;
      }, 3000);
    }
  }
}
