import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WorkshopCatalogStore } from '../../../application/workshop-catalog-store';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-technician-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule
  ],
  templateUrl: './technician-detail.component.html',
  styleUrls: ['./technician-detail.component.css']
})
export class TechnicianDetailComponent {
  private route = inject(ActivatedRoute);
  private store = inject(WorkshopCatalogStore);

  public autoRepairId = Number(this.route.snapshot.paramMap.get('autoRepairId'));
  public technicians = this.store.getAvailableTechniciansByRepair(this.autoRepairId); // Signal esperado
}
