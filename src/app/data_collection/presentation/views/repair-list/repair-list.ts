import { Component } from '@angular/core';
import {inject} from '@angular/core';
import {DataCollectionStore} from '../../../application/data-collection-store';
import {Router} from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {MatError} from '@angular/material/form-field';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-repair-list',
  imports: [MatCardModule, MatButtonModule, MatProgressSpinner, MatError, TranslatePipe,],
  templateUrl: './repair-list.html',
  styleUrl: './repair-list.css'
})
export class RepairList {

  readonly dataStore = inject(DataCollectionStore);
  readonly router = inject(Router);

  autoRepairs = this.dataStore.autoRepairs;

  selectRepair(repairId: number|string) {
    this.router.navigate(['/visits/new'], { queryParams: { id_auto_repair:repairId} });
  }

}
