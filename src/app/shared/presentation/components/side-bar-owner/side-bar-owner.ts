import { Component, inject } from '@angular/core';
import { ButtonLogout } from '../button-logout/button-logout';
import {LanguageSwitcher} from '@shared/presentation/components/language-switcher/language-switcher';
import {TranslateModule} from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-side-bar-owner',
  imports: [
    ButtonLogout, TranslateModule, CommonModule
  ],
  templateUrl: './side-bar-owner.html',
  styleUrl: './side-bar-owner.css'
})
export class SideBarOwner {
  private router = inject(Router);
  currentRoute = '';

  menuItems = [
    {
      route: '/layout-owner/profile',
      icon: 'user',
      label: 'side-bar-owner.profile'
    },
    {
      route: '/layout-owner/home-owner',
      icon: 'category',
      label: 'side-bar-owner.dashboard'
    },
    {
      route: '/layout-owner/vehicles',
      icon: 'car-suv',
      label: 'side-bar-owner.vehicles'
    },
    {
      route: '/layout-owner/search-workshop',
      icon: 'tool',
      label: 'side-bar-owner.searchWorkshop'
    },
    {
      route: '/layout-owner/history',
      icon: 'history',
      label: 'side-bar-owner.history'
    },
    {
      route: '/layout-owner/maintenance-tracking/track-vehicle',
      icon: 'diamonds',
      label: 'side-bar-owner.track'
    },
    {
      route: '/layout-owner/settings',
      icon: 'settings-bolt',
      label: 'side-bar-owner.settings'
    }
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

    // For nested routes like maintenance-tracking
    return route.includes('/maintenance-tracking/') && this.currentRoute.startsWith('/layout-owner/maintenance-tracking');
  }

  navigateTo(route: string): void {
    // Navigate to the relative route within layout-owner
    const relativePath = route.replace('/layout-owner/', '');
    this.router.navigate([relativePath], { relativeTo: this.router.routerState.root.firstChild }).then();
  }
}
