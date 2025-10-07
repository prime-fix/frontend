import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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

  technicians = signal<TechnicianRegister[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  name = signal('');
  schedules = signal<Array<{ day: string, start: string, end: string }>>([
    { day: 'Miércoles', start: '10:00', end: '18:00' },
    { day: 'Jueves', start: '10:00', end: '18:00' },
    { day: 'Viernes', start: '10:00', end: '18:00' }
  ]);

  constructor() {
    this.loadTechnicians();
  }

  /** Loads all technicians from API */
  loadTechnicians(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.getAll().subscribe({
      next: (list: TechnicianRegister[]) => {
        console.log('Technicians loaded:', list);
        this.technicians.set(list);
        this.loading.set(false);
      },
      error: (err: Error) => {
        console.error('Failed to fetch technicians:', err);
        this.error.set('Failed to fetch technicians: ' + (err.message || 'Unknown error'));
        this.loading.set(false);
      }
    });
  }

  deleteTechnician(tech: TechnicianRegister): void {
    if (!confirm(`¿Seguro que deseas eliminar al técnico ${tech.name}?`)) return;

    this.api.delete(tech.id).subscribe({
      next: () => {
        this.technicians.update(list => list.filter(t => t.id !== tech.id));
        alert('Técnico eliminado correctamente.');
      },
      error: (err: Error) => alert('No se pudo eliminar el técnico: ' + err.message)
    });
  }

  getAutoRepairName(id_auto_repair: string): string {
    const ar = this.autoRepairStore.getAutoRepairRegisterById(id_auto_repair)();
    return ar?.RUC ?? 'Unknown';
  }

  editTechnician(id: string): void {
    this.router.navigate(['/technicians/edit', id]).then();
  }

  submit(): void {
    if (!this.name()) {
      alert('Por favor ingresa el nombre del técnico.');
      return;
    }

    console.log('Agregar técnico:', this.name());
    console.log('Horarios:', this.schedules());
    alert(`Se intentaría agregar el técnico: ${this.name()}`);
  }

  createNew(): void {
    this.router.navigate(['/technicians/new']).then();
  }

  addScheduleDay(): void {
    this.schedules.update(s => [...s, { day: 'Lunes', start: '10:00', end: '18:00' }]);
  }

  removeScheduleDay(index: number): void {
    this.schedules.update(s => s.filter((_, i) => i !== index));
  }

  updateSchedule(index: number, field: 'day' | 'start' | 'end', value: string): void {
    this.schedules.update(s => {
      const updated = [...s];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }
}
