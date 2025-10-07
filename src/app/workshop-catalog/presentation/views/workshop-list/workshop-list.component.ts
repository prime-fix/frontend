import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkshopCatalogStore } from '../../../application/workshop-catalog-store';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-workshop-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatCardModule,
    TranslatePipe
  ],
  templateUrl: './workshop-list.component.html',
  styleUrls: ['./workshop-list.component.css']
})
export class WorkshopListComponent {
  private route = inject(ActivatedRoute);
  private store = inject(WorkshopCatalogStore);

  public district = this.route.snapshot.paramMap.get('district') || '';
  public workshops = this.store.getAutoRepairsByDistrict(this.district);

  viewDetail(id: number) {
    // navigate to technician list
  }
}
