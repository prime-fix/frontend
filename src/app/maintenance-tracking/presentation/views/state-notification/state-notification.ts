import {Component, computed, inject, output} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {TrackingStore} from '@tracking/application/tracking-store';
import {IamStore} from '@iam/application/iam-store';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {Notification} from '@tracking/domain/model/notification.entity';

@Component({
  selector: 'app-state-notification',
  imports: [TranslateModule, CommonModule],
  templateUrl: './state-notification.html',
  styleUrl: './state-notification.css'
})
export class StateNotification {
  private trackingStore = inject(TrackingStore);
  private iamStore = inject(IamStore);
  private router = inject(Router);

  close = output<void>();

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
   * Mark all notifications as read and close modal
   */
  onAccept() {
    this.markAllAsRead();
    this.close.emit();
  }

  /**
   * Click on a notification to navigate to track-vehicle
   * @param notification - The notification clicked
   */
  onNotificationClick(notification: Notification) {
    console.log('📬 Notification clicked:', notification);

    // Mark this notification as read
    const updatedNotification = new Notification({
      id: notification.id,
      message: notification.message,
      read: true,
      sent: notification.sent,
      vehicle_id: notification.vehicle_id
    });
    this.trackingStore.updateNotification(updatedNotification);

    // Navigate to track-vehicle with vehicleId
    this.router.navigate(['/layout-owner/track-vehicle'], {
      queryParams: { vehicleId: notification.vehicle_id }
    });

    // Close modal
    this.close.emit();
  }

  /**
   * Mark all unread notifications as read
   */
  private markAllAsRead() {
    const unread = this.unreadNotifications();
    console.log(`✅ Marking ${unread.length} notifications as read`);

    unread.forEach(notification => {
      const updatedNotification = new Notification({
        id: notification.id,
        message: notification.message,
        read: true,
        sent: notification.sent,
        vehicle_id: notification.vehicle_id
      });
      this.trackingStore.updateNotification(updatedNotification);
    });
  }

  onBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.markAllAsRead();
      this.close.emit();
    }
  }
}
