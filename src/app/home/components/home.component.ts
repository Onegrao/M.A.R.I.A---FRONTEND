import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  popupVisible = false;
  sidebarOpen = false;

  showPopup() {
    this.popupVisible = true;
  }

  hidePopup() {
    this.popupVisible = false;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  saveMachine() {
    const name = (document.getElementById('machineName') as HTMLInputElement).value;
    const type = (document.getElementById('machineType') as HTMLInputElement).value;
    console.log('Machine saved:', { name, type });
    this.hidePopup();
  }
}
