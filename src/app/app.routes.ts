import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'workshop-catalog',
    pathMatch: 'full'
  },
  {
    path: 'workshop-catalog',
    loadChildren: () => import('./workshop-catalog/presentation/views/workshop-catalog.module')
      .then(m => m.WorkshopCatalogModule)
  }
];
