import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

  constructor(private router: Router, private authService: AuthService) {}

  fazerLogin() {

    this.authService.login(this.usuario, this.senha).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido, token recebido:', response);
        this.erroLogin = '';
        this.showNotification = false;
        // Navega para a home APÓS o sucesso do login
        this.router.navigate(['/home']);
      },
      // Callback de ERRO
      error: (err) => {
        console.error('Falha no login:', err);
        this.erroLogin = 'Usuário ou senha incorretos. Por favor, tente novamente.';
        this.showNotification = true;
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
      }
    });
  }
}
