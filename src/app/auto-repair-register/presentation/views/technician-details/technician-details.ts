import { Component, inject, Input, Signal, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TechnicianRegisterApiEndpoint } from '../../../infrastructure/technician-register-api-endpoint';
import { TechnicianRegister } from '../../../domain/model/technician-register.entity';
import { AutoRepairRegisterStore } from '../../../application/auto-repair-register-store';

@Component({
  selector: 'app-technician-details',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './technician-details.html',
  styleUrls: ['./technician-details.css']
})
export class TechnicianDetails {
  private api = inject(TechnicianRegisterApiEndpoint);
  readonly autoRepairStore = inject(AutoRepairRegisterStore);
  public router = inject(Router);

  // Signals para el FORMULARIO
  name = signal('');
  age = signal(0);
  id_user_account = signal('');
  id_auto_repair = signal('');

  // Reactive signal for selected auto-repair register
  selectedAutoRepair: Signal<string> = computed(() => {
    const ar = this.autoRepairStore.getAutoRepairRegisterById(this.id_auto_repair())();
    return ar?.RUC ?? '';
  });

  // 👉 Propiedad pública (antes privada)
  public _technician?: TechnicianRegister;

  @Input() set technician(value: TechnicianRegister | undefined) {
    if (value) {
      this.name.set(value.name);
      this.age.set(value.age);
      this.id_user_account.set(value.id_user_account);
      this.id_auto_repair.set(value.id_auto_repair);
      this._technician = value;
    }
  }

  submit(): void {
    if (!this.name() || !this.age() || !this.id_user_account() || !this.id_auto_repair()) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }

    const tech = new TechnicianRegister({
      id_technician: this._technician?.id ?? 'TECH' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      name: this.name(),
      age: this.age(),
      id_user_account: this.id_user_account(),
      id_auto_repair: this.id_auto_repair()
    });

    if (this._technician) {
      this.api.update(tech, tech.id).subscribe({
        next: () => {
          alert('Técnico actualizado correctamente.');
          this.router.navigate(['/technicians']).then();
        },
        error: (err: Error) => alert('Error al actualizar técnico: ' + err.message)
      });
    } else {
      this.api.create(tech).subscribe({
        next: () => {
          alert('Técnico creado correctamente.');
          this.router.navigate(['/technicians']).then();
        },
        error: (err: Error) => alert('Error al crear técnico: ' + err.message)
      });
    }
  }
}
