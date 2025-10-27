import {Component, inject} from '@angular/core';
import { ButtonLogout } from '../button-logout/button-logout';
import {TranslateModule} from '@ngx-translate/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-side-bar-workshop',
  imports: [ButtonLogout, TranslateModule],
  templateUrl: './side-bar-workshop.html',
  styleUrl: './side-bar-workshop.css'
})
export class SideBarWorkshop {
  private router = inject(Router);
  currentRoute = '';

  menuItems = [
    {
      route: '/layout-workshop/profile',
      icon: 'user',
      label: 'side-bar-workshop.profile'
    },
    {
      route: '/layout-workshop/home-workshop',
      icon: 'category',
      label: 'side-bar-workshop.dashboard'
    },
    {
      route: '/layout-workshop/workshop',
      icon: 'tool',
      label: 'side-bar-workshop.workshop'
    },
    {
      route: '/layout-workshop/requests',
      icon: 'clipboard',
      label: 'side-bar-workshop.requests'
    },
    {
      route: '/layout-workshop/manage-technicians/technicians',
      icon: 'users',
      label: 'side-bar-workshop.manageTechnicians'
    },
    {
      route: '/layout-workshop/vehicle-diagnosis/diagnosis-view',
      icon: 'diamonds',
      label: 'side-bar-workshop.statusVehicles'
    },
    {
      route: '/layout-workshop/settings',
      icon: 'settings-bolt',
      label: 'side-bar-workshop.settings'
    },
  ];


  constructor() {
    // Get initial route
    this.currentRoute = this.router.url;

    // Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });
  }

  isActiveRoute(route: string): boolean {
    // For exact matches
    if (this.currentRoute === route) {
      return true;
    }

    // Check if current route starts with the menu item route
    // This handles child routes properly
    return this.currentRoute.startsWith(route + '/') || this.currentRoute.startsWith(route + '?');
  }

  navigateTo(route: string): void {
    // Navigate to the relative route within layout-owner
    const relativePath = route.replace('/layout-workshop/', '');
    this.router.navigate([relativePath], { relativeTo: this.router.routerState.root.firstChild }).then();
  }
}
