import {Routes} from '@angular/router';

const searchAutoRepair = () => import('@catalog/presentation/views/search-auto-repair/search-auto-repair').then(m => m.SearchAutoRepair);
const serviceForm =() => import('@catalog/presentation/views/service-form/service-form').then(m => m.ServiceForm);
const serviceOffer = ()=>import('@catalog/presentation/views/service-offers-form/service-offers-form').then(m => m.ServiceOffersForm);

export const autoRepairCatalogRoutes: Routes = [
  { path: 'search-auto-repair', loadComponent: searchAutoRepair },
  {path:'service-form', loadComponent:serviceForm},
  {path:'offer-form/:id', loadComponent:serviceOffer}
];
