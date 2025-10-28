import {Component, inject, OnInit, signal} from '@angular/core';
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
export class SideBarWorkshop implements OnInit {
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
   * Menu items for the workshop sidebar
   */
  menuItems = [
    {
      route: '/layout-workshop/profile',
      icon: 'user',
      label: 'side-bar-workshop.profile'
    },
    {
      route: '/layout-workshop/dashboard-workshop',
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
   * @returns boolean - True if the current route matches the specified route or is a child route
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
