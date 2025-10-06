import { Component } from '@angular/core';
import {inject} from '@angular/core';
import {DataCollection} from '../../../application/data-collection';
import {Router} from '@angular/router';
import {MatError} from '@angular/material/form-field';
import {MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable} from '@angular/material/table';
import {MatButton} from '@angular/material/button';
import {MatProgressSpinner} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-visit-list',
  imports: [ MatError, MatTable, MatHeaderCellDef, MatCellDef, MatColumnDef, MatHeaderCell,
    MatCell, MatHeaderRowDef, MatRowDef, MatButton, MatHeaderRow, MatRow, MatProgressSpinner],
  templateUrl: './visit-list.html',
  styleUrl: './visit-list.css'
})
export class VisitList {
  readonly dataStore = inject(DataCollection);
  readonly router = inject(Router);

  displayedColumn: string[] =['id','vehicle','failure','time_visit','id_auto_repair','service','status','actions'];

  editVisit(id:number){
    this.router.navigate(['/visits/edit', id]).then();
  }

  deleteVisit(id:number){
    this.dataStore.deleteVisit(id)
  }

  getVehicle(vehicleId: number | null | undefined) {
    return this.dataStore.getVehicleById(vehicleId);
  }

  getService(ServiceID: number | null | undefined) {
    return this.dataStore.getServiceById(ServiceID);
  }



}
