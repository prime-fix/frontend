import {Routes} from '@angular/router';

const searchAutoRepair = () => import('@catalog/presentation/views/search-auto-repair/search-auto-repair').then(m => m.SearchAutoRepair);

export const autoRepairCatalogRoutes: Routes = [
  { path: 'search-auto-repair', loadComponent: searchAutoRepair },
];
