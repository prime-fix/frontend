import {StatusVehicleList} from '../../../vehicle-status/presentation/views/status-vehicle-list/status-vehicle-list';
import {Diagnosis} from './diagnosis/diagnosis';
import {Routes} from '@angular/router';

export const DiagnosticRoutes: Routes = [
  { path: 'vehicle-status', component: StatusVehicleList }, // página inicial
  { path: 'vehicle-status/vehicle-diagnosis/:id', component: Diagnosis }, // sección de diagnóstico
];
