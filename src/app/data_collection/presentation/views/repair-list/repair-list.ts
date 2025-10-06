import { Component } from '@angular/core';
import {inject} from '@angular/core';
import {DataCollection} from '../../../application/data-collection';
import {Router} from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {MatError} from '@angular/material/form-field';

@Component({
  selector: 'app-repair-list',
  imports: [MatCardModule, MatButtonModule, MatProgressSpinner, MatError,],
  templateUrl: './repair-list.html',
  styleUrl: './repair-list.css'
})
export class RepairList {

  readonly dataStore = inject(DataCollection);
  readonly router = inject(Router);

  repair = this.dataStore.repairs;

  selectRepair(repairId: number) {
    this.router.navigate(['/visits/new'], { queryParams: { id_auto_repair:Number(repairId)} });
  }

}
