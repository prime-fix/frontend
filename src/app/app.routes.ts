import { Routes } from '@angular/router';
import {authGuard} from '@shared/infrastructure/guards/auth.guard';
import {Login} from '@iam/presentation/views/login/login';

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
const trackVehicle = () => import('@shared/presentation/views/track-vehicle/track-vehicle').then(m => m.TrackVehicle);
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
    canActivate: [authGuard],
    loadComponent: layoutOwner,
    children: [
      {
        path: '',
        loadComponent: homeOwner,
        title: `${baseTitle} -  Home Owner`,
      },
      {
        path: 'track-vehicle',
        loadComponent: trackVehicle,
        title: `${baseTitle} -  Track Vehicle`,
      },
      {
        path: '404',
        loadComponent: pageNotFound,
        title: `${baseTitle} -  Not Found`,
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  },
  {
    path: 'layout-workshop',
    canActivate: [authGuard],
    loadComponent: layoutWorkshop,
    children: [
      {
        path: '',
        loadComponent: homeWorkshop,
        title: `${baseTitle} -  Home Workshop`,
      },
      {
        path: '404',
        loadComponent: pageNotFound,
        title: `${baseTitle} -  Not Found`,
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  },

  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];

