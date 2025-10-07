import { Routes } from '@angular/router';
import { AutoRepairRegisterForm } from './auto-repair-register/presentation/views/auto-repair-register-form/auto-repair-register-form';
import { TechnicianDetails } from './auto-repair-register/presentation/views/technician-details/technician-details';
import { TechnicianList } from './auto-repair-register/presentation/views/technician-list/technician-list';

export const routes: Routes = [
  { path: '', redirectTo: 'auto-repair-register', pathMatch: 'full' },
  { path: 'auto-repair-register', component: AutoRepairRegisterForm },
  { path: 'technicians', component: TechnicianList },
  { path: 'technicians/:id', component: TechnicianDetails },
  { path: '**', redirectTo: 'auto-repair-register' }
];

