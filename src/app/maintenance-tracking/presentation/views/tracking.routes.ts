import {Routes} from '@angular/router';

const trackVehicle = () => import('@tracking/presentation/views/track-vehicle/track-vehicle').then(m => m.TrackVehicle);

export const trackingRoutes: Routes = [
  { path: 'track-vehicle', loadComponent: trackVehicle },
]
