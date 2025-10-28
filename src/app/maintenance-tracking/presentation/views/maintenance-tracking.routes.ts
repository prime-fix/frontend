import {Routes} from '@angular/router';

const trackVehicle = () => import('@tracking/presentation/views/track-vehicle/track-vehicle').then(m => m.TrackVehicle);
const notificationView = () => import('@tracking/presentation/views/notification-view/notification-view').then(m => m.NotificationView);
const manageVehicles = () => import('@tracking/presentation/views/manage-vehicles/manage-vehicles').then(m => m.ManageVehicles);

export const maintenanceTrackingRoutes: Routes = [
  { path: 'track-vehicle', loadComponent: trackVehicle },
  { path: 'notification-view', loadComponent: notificationView },
  { path: 'manage-vehicles', loadComponent: manageVehicles },
]
