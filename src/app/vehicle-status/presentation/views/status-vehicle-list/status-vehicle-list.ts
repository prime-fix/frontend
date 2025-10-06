import {Component, inject} from '@angular/core';
import {StatusVehicleStore} from '../../../application/status-vehicle-store';
import { StatusVehicleForm } from '../status-vehicle-form/status-vehicle-form';

@Component({
  selector: 'app-status-vehicle-list',
  imports: [
    StatusVehicleForm
  ],
  templateUrl: './status-vehicle-list.html',
  styleUrl: './status-vehicle-list.css'
})
export class StatusVehicleList {
  readonly store = inject(StatusVehicleStore);

  vehicles = this.store.status();
}
