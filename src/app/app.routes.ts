import { Routes } from '@angular/router';
import {Login} from '@iam/presentation/views/login/login';
import {RegisterOwner} from '@iam/presentation/views/register-owner/register-owner';

export const routes: Routes = [
  { path: 'login', component: Login, title: 'Login' },
  { path: 'register-owner', component: RegisterOwner, title: 'Register Owner' },
];

