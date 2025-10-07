import { Routes } from '@angular/router';
import {Home} from '@shared/presentation/views/home/home';

export const routes: Routes = [
  { path:'home',component: Home},
  { path: '', redirectTo: 'home', pathMatch: 'full'  },
  { path:'visits', loadChildren: () => import('./data_collection/presentation/views/data.routes').then(m => m.dataRoutes) },
  {path:'auto_repair', loadChildren:() => import('./data_collection/presentation/views/data.routes').then(m => m.dataRoutes) }

];
