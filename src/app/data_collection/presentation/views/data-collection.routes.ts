import {Routes} from '@angular/router';

const visitForm = () => import('./visit-form/visit-form').then(m => m.VisitForm);
const visitList = () => import('./visit-list/visit-list').then(m => m.VisitList);
const repairList=() => import('./repair-list/repair-list').then(m=>m.RepairList)
const completedScreen=() => import('./completed-screen/completed-screen').then(m=>m.CompletedScreen)


export const dataCollectionRoutes: Routes = [
  { path:'new-visit', loadComponent: visitForm},
  { path:'visit-list', loadComponent: visitList},
  { path:'auto-list', loadComponent:repairList},
  { path:'edit/:id', loadComponent: visitForm,data:{renderMode:'client'}},
  { path:'alert ', loadComponent:completedScreen}
];
