import { Routes } from '@angular/router';

const workshopSearch = () => import('./workshop-search/workshop-search').then(m => m.WorkshopSearchComponent);
const workshopList = () => import('./workshop-list/workshop-list.component').then(m => m.WorkshopListComponent);
const technicianDetail = () => import('./technician-detail/technician-detail.component').then(m => m.TechnicianDetailComponent);

export const workshopCatalogRoutes: Routes = [
  { path: 'search', loadComponent: workshopSearch },
  { path: 'list/:district', loadComponent: workshopList },
  { path: 'technicians/:autoRepairId', loadComponent: technicianDetail },
  { path: '', redirectTo: 'search', pathMatch: 'full' }
];
