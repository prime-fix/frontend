import { Routes } from '@angular/router';
const manageTechnicians = () => import('./manage-technicians/manage-technicians').then(m => m.ManageTechnicians);
const technicianForm = () => import('./technician-form/technician-form').then(m => m.TechnicianForm);

export const autoRepairRegisterRoutes: Routes = [
  { path: 'technicians', loadComponent: manageTechnicians  },
  { path: 'technicians/new', loadComponent: technicianForm },
  { path: 'technicians/edit/:id', loadComponent: technicianForm },
];
