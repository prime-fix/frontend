import { Routes } from '@angular/router';
import {Login} from '@iam/presentation/views/login/login';
import {autoRepairRegisterRoutes} from '@register/presentation/views/auto-repair-register.routes';
import {autoRepairCatalogRoutes} from '@catalog/presentation/views/auto-repair-catalog-routes';
import {maintenanceTrackingRoutes} from '@tracking/presentation/views/maintenance-tracking.routes';
import {VehicleDiagnosisRoutes} from '@diagnosis/presentation/views/vehicle-diagnosis.routes';
import {roleGuard} from '@shared/infrastructure/guards/role.guard';
import {dataCollectionRoutes} from '@collections/presentation/views/data-collection.routes';
import {paymentServiceRoutes} from '@payment/presentation/views/payment-service.routes';

const userRole = () => import('@iam/presentation/views/user-role/user-role').then(m => m.UserRole);
const registerOwner = () => import('@iam/presentation/views/register-owner/register-owner').then(m => m.RegisterOwner);
const registerWorkshop = () => import('@iam/presentation/views/register-workshop/register-workshop').then(m => m.RegisterWorkshop);
const planOwner = () => import('@iam/presentation/views/plan-owner/plan-owner').then(m => m.PlanOwner);
const planWorkshop = () => import('@iam/presentation/views/plan-workshop/plan-workshop').then(m => m.PlanWorkshop);
const paymentView = () => import('@iam/presentation/views/payment-view/payment-view').then(m => m.PaymentView);
const layoutOwner = () => import('@shared/presentation/components/layout-owner/layout-owner').then(m => m.LayoutOwner);
const layoutWorkshop = () => import('@shared/presentation/components/layout-workshop/layout-workshop').then(m => m.LayoutWorkshop);
const homeOwner = () => import('@shared/presentation/views/home-owner/home-owner').then(m => m.HomeOwner);
const homeWorkshop = () => import('@shared/presentation/views/home-workshop/home-workshop').then(m => m.HomeWorkshop);
const dashboardOwner = () => import('@shared/presentation/views/dashboard-owner/dashboard-owner').then(m => m.DashboardOwner);
const dashboardWorkshop = () => import('@shared/presentation/views/dashboard-workshop/dashboard-workshop').then(m => m.DashboardWorkshop);
const profile = () => import('@shared/presentation/views/profile/profile').then(m => m.Profile);
const settings = () => import('@shared/presentation/views/settings/settings').then(m => m.Settings);
const pageNotFound = () => import('@shared/presentation/views/page-not-found/page-not-found').then(m => m.PageNotFound);
const baseTitle = 'Prime Fix';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    title: `${baseTitle} -  Login`
  },
  {
    path: 'user-role',
    loadComponent: userRole,
    title: `${baseTitle} -  User Role`
  },
  {
    path: 'register-owner',
    loadComponent: registerOwner,
    title: `${baseTitle} -  Register Vehicle Owner`
  },
  {
    path: 'register-workshop',
    loadComponent: registerWorkshop,
    title: `${baseTitle} -  Register Workshop`
  },
  {
    path: 'plan-owner',
    loadComponent: planOwner,
    title: `${baseTitle} -  Plan Vehicle Owner`
  },
  {
    path: 'plan-workshop',
    loadComponent: planWorkshop,
    title: `${baseTitle} -  Plan Workshop`
  },
  {
    path: 'payment-view',
    loadComponent: paymentView,
    title: `${baseTitle} -  Payment`
  },
  {
    path: 'layout-owner',
    canActivate: [roleGuard([1])],
    loadComponent: layoutOwner,
    children: [
      {
        path: 'home-owner',
        loadComponent: homeOwner,
        title: `${baseTitle} -  Home Owner`,
      },
      {
        path: 'dashboard-owner',
        loadComponent: dashboardOwner,
        title: `${baseTitle} -  Dashboard Owner`,
      },
      {
        path: 'profile-owner',
        loadComponent: profile,
        title: `${baseTitle} -  Profile Owner`,
      },
      {
        path: 'settings-owner',
        loadComponent: settings,
        title: `${baseTitle} -  Settings Owner`,
      },
      {
        path: 'auto-repair-catalog',
        loadChildren : () => autoRepairCatalogRoutes,
        title: `${baseTitle} -  Auto Repair Catalog`,
      },
      {
        path: 'maintenance-tracking',
        loadChildren : () => maintenanceTrackingRoutes,
        title: `${baseTitle} -  Track Vehicle`,
      },
      {
        path:'data-collection',
        loadChildren:()=> dataCollectionRoutes,
        title:`${baseTitle} - Visit Management`
      },
      {
        path: 'payment-service',
        loadChildren: () => paymentServiceRoutes,
        title: `${baseTitle} -  Payment Service`,
      },
      {
        path: '404',
        loadComponent: pageNotFound,
        title: `${baseTitle} -  Not Found`,
      },
      {
        path: '**',
        redirectTo: 'dashboard-owner'
      }
    ]
  },
  {
    path: 'layout-workshop',
    canActivate: [roleGuard([2])],
    loadComponent: layoutWorkshop,
    children: [
      {
        path: 'home-workshop',
        loadComponent: homeWorkshop,
        title: `${baseTitle} -  Home Workshop`,
      },
      {
        path: 'dashboard-workshop',
        loadComponent: dashboardWorkshop,
        title: `${baseTitle} -  Dashboard Workshop`,
      },
      {
        path: 'profile-workshop',
        loadComponent: profile,
        title: `${baseTitle} -  Profile Workshop`,
      },
      {
        path: 'settings-workshop',
        loadComponent: settings,
        title: `${baseTitle} -  Settings Workshop`,
      },
      {
        path: 'auto-repair-register',
        loadChildren: () => autoRepairRegisterRoutes,
        title: `${baseTitle} -  Manage Technicians`,
      },
      {
        path: 'vehicle-diagnosis',
        loadChildren: () => VehicleDiagnosisRoutes,
        title: `${baseTitle} -  Vehicle Diagnosis`,
      },
      {
        path: '404',
        loadComponent: pageNotFound,
        title: `${baseTitle} -  Not Found`,
      },
      {
        path: '**',
        redirectTo: 'dashboard-workshop'
      }
    ]
  },

  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];
