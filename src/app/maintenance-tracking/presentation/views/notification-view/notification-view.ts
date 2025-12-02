import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TrackingStore } from '@tracking/application/tracking-store';
import { Notification } from '@tracking/domain/model/notification.entity';
import {IamStore} from '@iam/application/iam-store';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-notification-view',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './notification-view.html',
  styleUrl: './notification-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationView {
  private trackingStore = inject(TrackingStore);
  private iamStore = inject(IamStore);
  private router = inject(Router);

  // Vehicles filtered by userId
  vehiclesByUserId = computed(() => {
    const userId = this.iamStore.sessionUserId();
    return userId ? this.trackingStore.vehicles().filter(vehicle => this.iamStore.isCurrentUser(vehicle.user_id)) : [];
  });

  notificationsByVehiclesId = computed(() => {
    const vehicleIds = this.vehiclesByUserId().map(v => v.id);
    return this.trackingStore.notifications().filter(notification => vehicleIds.includes(notification.vehicle_id));
  })

  loading = this.trackingStore.loading;
  error = this.trackingStore.error;

  // Computed signals for filtered notifications
  unreadNotifications = computed(() =>
    this.notificationsByVehiclesId().filter(n => !n.read)
  );

  readNotifications = computed(() =>
    this.notificationsByVehiclesId().filter(n => n.read)
  );

  unreadCount = computed(() => this.unreadNotifications().length);

  /**
   * Handle notification click - mark as read and navigate to track vehicle
   */
  onNotificationClick(notification: Notification): void {
    // Mark as read if unread
    if (!notification.read) {
      const updatedNotification = new Notification({
        id: notification.id,
        message: notification.message,
        sent: notification.sent,
        vehicle_id: notification.vehicle_id,
        read: true,
      });
      this.trackingStore.updateNotification(updatedNotification);
    }

    // Navigate to track-vehicle with vehicle_id as query parameter
    this.router.navigate(['/layout-owner/maintenance-tracking/track-vehicle'], {
      queryParams: { vehicleId: notification.vehicle_id }
    });
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    this.unreadNotifications().forEach(notification => {
      const updatedNotification = new Notification({
        id: notification.id,
        message: notification.message,
        sent: notification.sent,
        vehicle_id: notification.vehicle_id,
        read: true,
      });
      this.trackingStore.updateNotification(updatedNotification);
    });
  }

  /**
   * Format date to readable string
   */
  formatDate(date: Date): string {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMs = now.getTime() - notificationDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    if (diffInDays < 7) return `Hace ${diffInDays}d`;

    return notificationDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}
