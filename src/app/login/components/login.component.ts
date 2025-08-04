import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  erroLogin: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { usuario, senha } = this.loginForm.value;
      this.http.post('/api/login', { username: usuario, password: senha }).subscribe({
        next: (response: any) => {
          console.log('Login bem-sucedido:', response);
          // Redirecionar para o dashboard ou tratar o login com sucesso
        },
        error: (error: any) => {
          if (error.status === 404) {
            this.erroLogin = 'Usuário não cadastrado';
          } else if (error.status === 401) {
            this.erroLogin = 'Senha incorreta';
          } else {
            this.erroLogin = 'Erro ao tentar fazer login';
          }
        }
      });
    } else {
      this.erroLogin = 'Por favor, preencha todos os campos';
    }
  }
}
