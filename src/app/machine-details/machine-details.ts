import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {Maquina, MaquinaService} from '../services/maquina.service';

@Component({
  selector: 'app-machine-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './machine-details.html',
  styleUrls: ['./machine-details.css']
})
export class MachineDetails implements OnInit {

  maquina: Maquina | undefined;

  isLoading = true;

  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private maquinaService: MaquinaService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.carregarDetalhesMaquina();
  }

  carregarDetalhesMaquina(): void {
    const idString = this.route.snapshot.paramMap.get('id');
    if (idString) {
      const id = +idString;
      this.isLoading = true;
      this.error = null;
      this.maquinaService.getMaquinaById(id).subscribe({
        next: (data) => {
          this.maquina = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Não foi possível carregar os detalhes. A máquina não foi encontrada ou a API está offline.';
          this.isLoading = false;
        }
      });
    } else {
      this.error = 'ID da máquina não fornecido na URL.';
      this.isLoading = false;
    }
  }

  getStatusLabel(statusKey: string): string {
    const labels: { [key: string]: string } = {
      'corretiva': 'Manutenção Corretiva',
      'preventiva': 'Realizar Preventiva',
      'desligada': 'Desligada'
    };
    return labels[statusKey] || 'Desconhecido';
  }

  goBack(): void {
    this.location.back();
  }
}
