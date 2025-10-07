import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// Importa todos los componentes que uses en este feature

import { workshopCatalogRoutes } from './workshop-catalog.routes';
// Importa tus componentes, por ejemplo:
// import { WorkshopSearchComponent } from './views/workshop-search/workshop-search.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(workshopCatalogRoutes)
  ],
  declarations: [
    // WorkshopSearchComponent, WorkshopListComponent, TechnicianDetailComponent, ...
  ]
})
export class WorkshopCatalogModule {}
