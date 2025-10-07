import { Component, inject, Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TechnicianRegisterApiEndpoint } from '../../../infrastructure/technician-register-api-endpoint';
import { TechnicianRegister } from '../../../domain/model/technician-register.entity';
import { AutoRepairRegisterStore } from '../../../application/auto-repair-register-store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-technician-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './technician-list.html',
  styleUrls: ['./technician-list.css']
})
export class TechnicianList {
  private api = inject(TechnicianRegisterApiEndpoint);
  public router = inject(Router);
  readonly autoRepairStore = inject(AutoRepairRegisterStore);

  // Signals
  technicians = signal<TechnicianRegister[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  // Propiedad para ngModel
  name: string = '';

  constructor() {
    this.loadTechnicians();
  }

  /** Loads all technicians from API */
  loadTechnicians(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.getAll().subscribe({
      next: (list) => {
        // Solo asignamos la lista directamente, sin schedules
        this.technicians.set(list);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message ?? 'Failed to load technicians');
        this.loading.set(false);
      }
    });
  }

  /** Deletes a technician */
  deleteTechnician(tech: TechnicianRegister): void {
    if (!confirm(`¿Seguro que deseas eliminar al técnico ${tech.name}?`)) return;

    this.api.delete(tech.id).subscribe({
      next: () => {
        this.technicians.update(list => list.filter(t => t.id !== tech.id));
        alert('Técnico eliminado correctamente.');
      },
      error: (err) => alert('No se pudo eliminar el técnico: ' + err.message)
    });
  }

  /** Navigate to edit page */
  editTechnician(id: string): void {
    this.router.navigate([`auto-repair-register/technicians/edit/${id}`]).then();
  }

  /** Submit method usado en el template para agregar técnico */
  submit(): void {
    console.log('Agregar técnico:', this.name);
    alert(`Se intentaría agregar el técnico: ${this.name}`);
  }

  /** Navigate to new technician page */
  createNew(): void {
    this.router.navigate(['auto-repair-register/technicians/new']).then();
  }
}
