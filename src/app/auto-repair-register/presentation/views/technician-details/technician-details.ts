import { Component, inject, Input, Signal, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TechnicianRegisterApiEndpoint } from '../../../infrastructure/technician-register-api-endpoint';
import { TechnicianRegister } from '../../../domain/model/technician-register.entity';
import { AutoRepairRegisterStore } from '../../../application/auto-repair-register-store';

@Component({
  selector: 'app-technician-details',
  imports: [RouterLink, FormsModule],
  templateUrl: './technician-details.html',
  styleUrls: ['./technician-details.css']
})
export class TechnicianDetails {
  private api = inject(TechnicianRegisterApiEndpoint);
  readonly autoRepairStore = inject(AutoRepairRegisterStore);
  public router = inject(Router);

  // Signals for form fields
  name = signal('');
  age = signal(0);
  id_user_account = signal('');
  id_auto_repair = signal('');

  // Reactive signal for selected auto-repair register
  selectedAutoRepair: Signal<string> = computed(() => {
    const ar = this.autoRepairStore.getAutoRepairRegisterById(this.id_auto_repair())();
    return ar?.RUC ?? '';
  });

  @Input() set technician(value: TechnicianRegister | undefined) {
    if (value) {
      this.name.set(value.name);
      this.age.set(value.age);
      this.id_user_account.set(value.id_user_account);
      this.id_auto_repair.set(value.id_auto_repair);
      this._technician = value;
    }
  }

  private _technician?: TechnicianRegister;

  submit() {
    if (!this.name() || !this.age() || !this.id_user_account() || !this.id_auto_repair()) {
      alert('Please fill in all required fields.');
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
          alert('Technician updated successfully.');
          this.router.navigate(['auto-repair-register/technicians']).then();
        },
        error: (err) => alert('Failed to update technician: ' + err.message)
      });
    } else {
      this.api.create(tech).subscribe({
        next: () => {
          alert('Technician created successfully.');
          this.router.navigate(['auto-repair-register/technicians']).then();
        },
        error: (err) => alert('Failed to create technician: ' + err.message)
      });
    }
  }
}
