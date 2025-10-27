import {Component, inject} from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Visit } from '../../../domain/model/visit.entity';
import { Location, CommonModule } from '@angular/common';
import {TranslateModule, TranslatePipe} from '@ngx-translate/core';
import {DataCollectionStore} from '../../../application/data-collection-store';

@Component({
  selector: 'app-visit-alert',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './completed-screen.html',
  styleUrl: './completed-screen.css'
})
export class CompletedScreen {
  private router = inject(Router);
  private location = inject(Location);
  readonly dataStore = inject(DataCollectionStore);

  visit: Visit | null = null;

  constructor() {
    const state = history.state;
    this.visit = state['visit'] ?? null;
    console.log('Visit recibida:', this.visit);
  }

  goBack() {
    this.router.navigate(['home']).then();
  }

  goVisitList(){
    this.router.navigate(['visits/list']).then();
  }

  getVehicle(vehicleId: number | string |null | undefined) {
    return this.dataStore.getVehicleById(vehicleId);
  }

  getService(ServiceID: number |string | null | undefined) {
    return this.dataStore.getServiceById(ServiceID);
  }


}
