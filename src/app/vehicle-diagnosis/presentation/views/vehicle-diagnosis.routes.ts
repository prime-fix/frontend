import {Diagnosis} from './diagnosis/diagnosis';
import {Routes} from '@angular/router';

export const DiagnosticRoutes: Routes = [
  { path: 'vehicle-status/vehicle-diagnosis/:id', component: Diagnosis }, // sección de diagnóstico
];
