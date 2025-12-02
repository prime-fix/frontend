import {Component, computed, effect, inject, signal} from '@angular/core';
import { SideBarOwner } from '@shared/presentation/components/side-bar-owner/side-bar-owner';
import {RouterOutlet} from '@angular/router';
import {TrackingStore} from '@tracking/application/tracking-store';
import {StateNotification} from '@tracking/presentation/views/state-notification/state-notification';
import {IamStore} from '@iam/application/iam-store';

@Component({
  selector: 'app-layout-owner',
  imports: [SideBarOwner, RouterOutlet, StateNotification],
  templateUrl: './layout-owner.html',
  styleUrl: './layout-owner.css'
})
export class LayoutOwner {
  private trackingStore = inject(TrackingStore);
  private iamStore = inject(IamStore);

  showNotificationModal = signal<boolean>(false);

  /**
   * Get unread notifications for current user
   */
  unreadNotifications = computed(() => {
    const userId = this.iamStore.sessionUserId();
    if (!userId) return [];

    return this.trackingStore.unreadNotifications().filter(notification => {
      const vehicle = this.trackingStore.getVehicleById(notification.vehicle_id)();
      return vehicle?.user_id === userId;
    });
  });

  /**
   * Count of unread notifications
   */
  unreadCount = computed(() => this.unreadNotifications().length);

  /**
   * Effect to automatically open modal when new unread notifications arrive
   */
  private autoOpenNotificationEffect = effect(() => {
    const unreadCount = this.unreadCount();

    // Only auto-open if there are unread notifications and modal is not already open
    if (unreadCount > 0 && !this.showNotificationModal()) {
      console.log(`📬 [LayoutOwner] New notification detected! Opening modal automatically (${unreadCount} unread)`);
      this.showNotificationModal.set(true);
    }
  });


  /**
   * Close notification modal
   */
  closeNotificationModal() {
    console.log('✅ [LayoutOwner] Closing notification modal');
    this.showNotificationModal.set(false);
  }
}
