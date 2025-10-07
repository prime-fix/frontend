import { Component, inject, Input } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AutoRepairRegisterStore } from '../../../application/auto-repair-register-store';
import { AutoRepairRegister } from '../../../domain/model/auto-repair-register.entity';

@Component({
  selector: 'app-auto-repair-register-form',
  imports: [RouterLink, FormsModule],
  templateUrl: './auto-repair-register-form.html',
  styleUrls: ['./auto-repair-register-form.css']
})
export class AutoRepairRegisterForm {
  readonly store = inject(AutoRepairRegisterStore);
  public router = inject(Router);

  // Local editable fields (UI)
  nombre_taller = '';
  nombre_usuario = '';
  telefono = '';
  departamento = '';
  direccion = '';
  password = '';

  // Fields that map to AutoRepairRegister entity
  RUC = '';
  contact_email = '';
  id_location = '';
  technicians_count = 1;

  // backing field for the @Input
  private _autoRepair?: AutoRepairRegister;

  @Input()
  set autoRepair(value: AutoRepairRegister | undefined) {
    this._autoRepair = value;
    if (value) {
      // Map only properties that actually exist in the AutoRepairRegister entity
      // (avoid trying to access fields that do not exist on the entity class)
      this.RUC = (value as any).RUC ?? '';
      this.contact_email = (value as any).contact_email ?? '';
      this.technicians_count = (value as any).technicians_count ?? 1;
      this.id_location = (value as any).id_location ?? '';
      // keep UI-only fields empty or initialize from available entity fields if you have them
    }
  }

  // Submit: build entity using only the allowed properties
  submit() {
    // basic validation
    if (!this.RUC || !this.contact_email || !this.id_location) {
      alert('Please fill in RUC, email and district/location.');
      return;
    }

    const id_auto_repair =
      this._autoRepair?.id ??
      'AR' + Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    // Build entity payload with the properties the AutoRepairRegister expects
    const register = new AutoRepairRegister({
      id_auto_repair,
      RUC: this.RUC,
      contact_email: this.contact_email,
      technicians_count: this.technicians_count,
      id_location: this.id_location
    });

    if (this._autoRepair) {
      this.store.updateAutoRepairRegister(register);
      alert('Auto repair register updated successfully.');
    } else {
      this.store.addAutoRepairRegister(register);
      alert('Auto repair register created successfully.');
    }

    // navigate back to the list (adjust route if needed)
    void this.router.navigate(['auto-repair-register/auto-repairs']);
  }
}
