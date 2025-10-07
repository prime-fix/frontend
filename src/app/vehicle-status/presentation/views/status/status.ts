import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {StatusVehicleStore} from '../../../application/status-vehicle-store';

@Component({
  selector: 'app-status',
  imports: [
    RouterLink,
  ],
  templateUrl: './status.html',
  styleUrl: './status.css'
})
export class Status {
  readonly store = inject(StatusVehicleStore);
}
