import {Routes} from '@angular/router';

const trackVehicle = () => import('@tracking/presentation/views/track-vehicle/track-vehicle').then(m => m.TrackVehicle);
const notificationView = () => import('@tracking/presentation/views/notification-view/notification-view').then(m => m.NotificationView);

export const trackingRoutes: Routes = [
  { path: 'track-vehicle', loadComponent: trackVehicle },
  { path: 'notification-view', loadComponent: notificationView },
]
