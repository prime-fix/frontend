import {Routes} from '@angular/router';

const visitForm = () => import('./visit-form/visit-form').then(m => m.VisitForm);
const visitsHistory = () => import('./visits-history/visits-history').then(m => m.VisitsHistory);

export const dataCollectionRoutes: Routes = [
  { path:'new-visit', loadComponent: visitForm},
  { path:'edit/:id', loadComponent: visitForm,data:{renderMode:'client'}},
  { path: 'visits-history', loadComponent: visitsHistory },
];
