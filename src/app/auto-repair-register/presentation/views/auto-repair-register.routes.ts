import { Routes } from '@angular/router';

// Lazy load components
const technicianList = () =>
  import('./technician-list/technician-list').then(
    (m) => m.TechnicianList
  );
const technicianDetails = () =>
  import('./technician-details/technician-details').then(
    (m) => m.TechnicianDetails
  );
const autoRepairRegisterForm = () =>
  import('./auto-repair-register-form/auto-repair-register-form').then(
    (m) => m.AutoRepairRegisterForm
  );

export const autoRepairRegisterRoutes: Routes = [
  // Technician routes
  { path: 'technicians', loadComponent: technicianList },
  { path: 'technicians/new', loadComponent: technicianDetails },
  { path: 'technicians/edit/:id', loadComponent: technicianDetails },

  // Auto repair registration routes
  { path: 'auto-repairs', loadComponent: autoRepairRegisterForm },
  { path: 'auto-repairs/new', loadComponent: autoRepairRegisterForm },
  { path: 'auto-repairs/edit/:id', loadComponent: autoRepairRegisterForm }
];

