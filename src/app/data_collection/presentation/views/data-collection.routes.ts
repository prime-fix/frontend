import {Routes} from '@angular/router';

const visitForm = () => import('./visit-form/visit-form').then(m => m.VisitForm);
const visitAlert = () => import('./visit-alert/visit-alert').then(m => m.VisitAlert);
const visitsHistory = () => import('./visits-history/visits-history').then(m => m.VisitsHistory);

export const dataCollectionRoutes: Routes = [
  { path: 'new-visit/:id', loadComponent: visitForm},
  { path: 'visit-alert', loadComponent: visitAlert },
  { path: 'visits-history', loadComponent: visitsHistory },
];
