import { Routes } from '@angular/router';
import {Diagnosis} from './vehicle-diagnosis/presentation/views/diagnosis/diagnosis';
import {Status} from './vehicle-status/presentation/views/status/status';
import {StatusVehicleForm} from './vehicle-status/presentation/views/status-vehicle-form/status-vehicle-form';
import {StatusVehicleList} from './vehicle-status/presentation/views/status-vehicle-list/status-vehicle-list';

export const routes: Routes = [
  { path: '', redirectTo: 'vehicle-status', pathMatch: 'full' },
  { path: 'vehicle-status', component: StatusVehicleList }, // página inicial
  { path: 'vehicle-status/vehicle-diagnosis/:id', component: Diagnosis }, // sección de diagnóstico
];
