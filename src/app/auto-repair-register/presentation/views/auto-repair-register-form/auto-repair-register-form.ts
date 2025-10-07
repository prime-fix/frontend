import { Component, inject, Input } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AutoRepairRegisterStore } from '../../../application/auto-repair-register-store';
import { AutoRepairRegister } from '../../../domain/model/auto-repair-register.entity';
import { signal } from '@angular/core';

@Component({
  selector: 'app-auto-repair-register-form',
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './auto-repair-register-form.html',
  styleUrls: ['./auto-repair-register-form.css']
})
export class AutoRepairRegisterForm {
  readonly store = inject(AutoRepairRegisterStore);
  public router = inject(Router);

  // Signals for the form
  RUC = signal('');
  contact_email = signal('');
  technicians_count = signal(1);
  id_location = signal('');

  // Setter to initialize signals when input is set
  @Input() set autoRepair(value: AutoRepairRegister | undefined) {
    if (value) {
      this.RUC.set(value.RUC);
      this.contact_email.set(value.contact_email);
      this.technicians_count.set(value.technicians_count);
      this.id_location.set(value.id_location);
    }
  }

  submit() {
    // Validation
    if (!this.RUC() || !this.contact_email() || !this.id_location()) {
      alert('Please fill in all required fields.');
      return;
    }

    const register = new AutoRepairRegister({
      id_auto_repair: this.autoRepair?.id ?? 'AR' + Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
      RUC: this.RUC(),
      contact_email: this.contact_email(),
      technicians_count: this.technicians_count(),
      id_location: this.id_location()
    });

    if (this.autoRepair) {
      this.store.updateAutoRepairRegister(register);
      alert('Auto repair register updated successfully.');
    } else {
      this.store.addAutoRepairRegister(register);
      alert('Auto repair register created successfully.');
    }

    this.router.navigate(['auto-repair-register/auto-repairs']).then();
  }
}
