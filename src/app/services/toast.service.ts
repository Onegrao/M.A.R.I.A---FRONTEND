import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// Define a estrutura de uma notificação Toast
export interface Toast {
  message: string;
  type: 'success' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new Subject<Toast | null>();
  public toastState = this.toastSubject.asObservable();


  show(message: string, type: 'success' | 'error' = 'success') {
    // Envia a notificação para quem estiver ouvindo
    this.toastSubject.next({ message, type });

    // Agenda o desaparecimento da notificação após 4 segundos
    setTimeout(() => this.toastSubject.next(null), 4000);
  }
}
