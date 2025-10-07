import {Routes} from '@angular/router';
import {Home} from '@shared/presentation/views/home/home';

const visitForm = () => import('./visit-form/visit-form').then(m => m.VisitForm);
const visitList = () => import('./visit-list/visit-list').then(m => m.VisitList);
const repairList=() => import('./repair-list/repair-list').then(m=>m.RepairList)

export const dataRoutes: Routes = [
  { path: 'new', loadComponent: visitForm},
  { path:'list', loadComponent: visitList},
  { path:'auto_list', loadComponent:repairList},
  { path:'edit/:id', loadComponent: visitForm},
];
