import { Routes } from '@angular/router';
const manageTechnicians = () => import('./manage-technicians/manage-technicians').then(m => m.ManageTechnicians);
const technicianForm = () => import('./technician-form/technician-form').then(m => m.TechnicianForm);
const manageAutoRepair = () => import('./manage-auto-repair/manage-auto-repair').then(m => m.ManageAutoRepair);
const manageRequests = () => import('./manage-requests/manage-requests').then(m => m.ManageRequests);

export const autoRepairRegisterRoutes: Routes = [
  { path: 'technicians', loadComponent: manageTechnicians  },
  { path: 'technicians/new', loadComponent: technicianForm },
  { path: 'technicians/edit/:id', loadComponent: technicianForm },
  { path: 'manage-auto-repair', loadComponent: manageAutoRepair  },
  { path: 'manage-requests', loadComponent: manageRequests  },
];
