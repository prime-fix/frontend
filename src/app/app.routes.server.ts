import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'layout-workshop/auto-repair-register/technicians/edit/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'layout-owner/data-collection/new-visit/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'layout-workshop/vehicle-diagnosis/modify-diagnosis/edit/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'layout-workshop/vehicle-diagnosis/check-diagnostics/**',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
