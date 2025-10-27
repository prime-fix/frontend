import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'layout-workshop/manage-technicians/technicians/edit/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'layout-workshop/manage-technicians/technicians/edit/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'layout-owner/visits/edit/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'layout-workshop/vehicle-diagnosis/modify-diagnosis/edit/**',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
