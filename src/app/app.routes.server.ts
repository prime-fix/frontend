import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'layout-workshop/manage-technicians/technicians/edit/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'layout-workshop/manage-technicians/auto-repairs/edit/**',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
