import {Routes} from '@angular/router';

const searchAutoRepair = () => import('@catalog/presentation/views/search-auto-repair/search-auto-repair').then(m => m.SearchAutoRepair);
const scheduleVisit = () => import('@catalog/presentation/views/schedule-visit/schedule-visit').then(m => m.ScheduleVisit);

export const autoRepairCatalogRoutes: Routes = [
  { path: 'search-auto-repair', loadComponent: searchAutoRepair },
  { path: 'schedule-visit', loadComponent: scheduleVisit },
];
