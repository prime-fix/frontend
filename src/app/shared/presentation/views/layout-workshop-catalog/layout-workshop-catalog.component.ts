import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-layout-workshop',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    TranslateModule
  ],
  templateUrl: './layout-workshop-catalog.component.html',
  styleUrls: ['./layout-workshop-catalog.component.css']
})
export class LayoutWorkshopComponent {
  private router = inject(RouterModule);

  // Opciones del sidebar
  public options = [
    { link: '/workshop-catalog/search', label: 'workshop.search' },
    { link: '/workshop-catalog/list',  label: 'workshop.list-title' },
    { link: '/workshop-catalog/technicians', label: 'view-technicians' }
  ];
}
