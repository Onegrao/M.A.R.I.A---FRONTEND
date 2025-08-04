import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  popupVisible = false;

  showPopup() {
    this.popupVisible = true;
  }

  hidePopup() {
    this.popupVisible = false;
  }

  saveMachine() {
    const name = (document.getElementById('machineName') as HTMLInputElement).value;
    const type = (document.getElementById('machineType') as HTMLInputElement).value;
    console.log('Machine saved:', { name, type });
    this.hidePopup();
  }
}
