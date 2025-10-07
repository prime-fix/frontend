import { Component } from '@angular/core';
import {inject} from '@angular/core';
import {DataCollection} from '../../../application/data-collection';
import {Router} from '@angular/router';
import {MatError} from '@angular/material/form-field';
import {MatButton} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-visit-list',
  imports: [ MatError, MatButton, MatProgressSpinner],
  templateUrl: './visit-list.html',
  styleUrl: './visit-list.css'
})
export class VisitList {
  readonly dataStore = inject(DataCollection);
  readonly router = inject(Router);

  editVisit(id:number|string){
    this.router.navigate(['/visits/edit', id]).then();
  }

  deleteVisit(id:number|string){
    this.dataStore.deleteVisit(id)
  }

  getVehicle(vehicleId: number | string |null | undefined) {
    return this.dataStore.getVehicleById(vehicleId);
  }

  getService(ServiceID: number |string | null | undefined) {
    return this.dataStore.getServiceById(ServiceID);
  }



}
