import {Component, inject, signal, OnInit, effect} from '@angular/core';
import {ButtonLogout} from '../button-logout/button-logout';
import {TranslateModule} from '@ngx-translate/core';
import {NavigationEnd, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-side-bar-owner',
  imports: [
    ButtonLogout, TranslateModule, CommonModule
  ],
  templateUrl: './side-bar-owner.html',
  styleUrl: './side-bar-owner.css'
})
export class SideBarOwner implements OnInit {
  /**
   * Router instance
   * @private
   */
  private router = inject(Router);
  /**
   * Current route signal
   */
  currentRoute = signal('');

  /**
   * Menu items for the owner sidebar
   */
  menuItems = [
    {
      route: '/layout-owner/profile-owner',
      icon: 'user',
      label: 'side-bar-owner.profile'
    },
    {
      route: '/layout-owner/dashboard-owner',
      icon: 'category',
      label: 'side-bar-owner.dashboard'
    },
    {
      route: '/layout-owner/maintenance-tracking/manage-vehicles',
      icon: 'car-suv',
      label: 'side-bar-owner.vehicles'
    },
    {
      route: '/layout-owner/auto-repair-catalog/search-auto-repair',
      icon: 'tool',
      label: 'side-bar-owner.searchWorkshop'
    },
    {
      route: '/layout-owner/data-collection/visits-history',
      icon: 'history',
      label: 'side-bar-owner.history'
    },
    {
      route: '/layout-owner/maintenance-tracking/track-vehicle',
      icon: 'diamonds',
      label: 'side-bar-owner.track'
    },
    {
      route: '/layout-owner/settings-owner',
      icon: 'settings-bolt',
      label: 'side-bar-owner.settings'
    },
    {
      "route": '/layout-owner/maintenance-tracking/notification-view',
      "icon": 'bell',
      "label": 'side-bar-owner.notifications'
    },
  ];

  /**
   * Constructor
   */
  constructor() {
    // Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute.set(event.url);
      });
  }

  /**
   * Initialize the component
   * @returns void
   */
  ngOnInit(): void {
    // Set initial route after component initialization
    const initialRoute = this.router.url;
    this.currentRoute.set(initialRoute);

    // Force change detection
    setTimeout(() => {
      this.currentRoute.set(this.router.url);
    }, 0);
  }

  /**
   * Get the current route
   * @param route - The route to check
   * @returns boolean - True if the route is active, false otherwise
   */
  isActiveRoute(route: string): boolean {
    const current = this.currentRoute();
    // For exact matches
    if (current === route) {
      return true;
    }

    // Check if current route starts with the menu item route
    // This handles child routes properly
    return current.startsWith(route + '/') || current.startsWith(route + '?');
  }

  /**
   * Navigate to the specified route
   * @param route - The route to navigate to
   * @returns void
   */
  navigateTo(route: string): void {
    // Navigate to the absolute route
    this.router.navigate([route]).then();
  }
}
