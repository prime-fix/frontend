import { Component, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackingStore } from '@tracking/application/tracking-store';
import { Notification } from '@tracking/domain/model/notification.entity';
import {IamStore} from '@iam/application/iam-store';

@Component({
  selector: 'app-notification-view',
  imports: [CommonModule],
  templateUrl: './notification-view.html',
  styleUrl: './notification-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationView {
  private trackingStore = inject(TrackingStore);
  private iamStore = inject(IamStore);

  // Vehicles filtered by userId
  vehiclesByUserId = computed(() => {
    const userId = this.iamStore.sessionUser()?.id;
    return userId ? this.trackingStore.vehicles().filter(vehicle => vehicle.id_user === userId) : [];
  });

  notificationsByVehiclesId = computed(() => {
    const vehicleIds = this.vehiclesByUserId().map(v => v.id);
    return this.trackingStore.notifications().filter(notification => vehicleIds.includes(notification.id_vehicle));
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
   * Mark a notification as read
   */
  markAsRead(notification: Notification): void {
    if (!notification.read) {
      const updatedNotification = new Notification({
        id_notification: notification.id,
        message: notification.message,
        sent: notification.sent,
        id_vehicle: notification.id_vehicle,
        read: true,
        id_diagnostic: notification.id_diagnostic,
      })
      this.trackingStore.updateNotification(updatedNotification);
    }
  }

  /**
   * Mark a notification as unread
   */
  markAsUnread(notification: Notification): void {
    if (notification.read) {
      const updatedNotification = new Notification({
        id_notification: notification.id,
        message: notification.message,
        sent: notification.sent,
        id_vehicle: notification.id_vehicle,
        read: false,
        id_diagnostic: notification.id_diagnostic,
      });
      this.trackingStore.updateNotification(updatedNotification);
    }
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    this.unreadNotifications().forEach(notification => {
      const updatedNotification = new Notification({
        id_notification: notification.id,
        message: notification.message,
        sent: notification.sent,
        id_vehicle: notification.id_vehicle,
        read: true,
        id_diagnostic: notification.id_diagnostic,
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
