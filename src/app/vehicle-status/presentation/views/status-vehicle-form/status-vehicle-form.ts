import {Component, inject, Input, input, InputSignal} from '@angular/core';
import {RouterLink, Router} from '@angular/router';
import {StatusVehicleStore} from '../../../application/status-vehicle-store';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-status-vehicle-form',
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './status-vehicle-form.html',
  styleUrl: './status-vehicle-form.css'
})
export class StatusVehicleForm {
  readonly store = inject(StatusVehicleStore);
  @Input() vehicle: any;
}
