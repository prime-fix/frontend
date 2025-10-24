import {computed, Injectable, Signal, signal} from '@angular/core';
import {Notification} from '@tracking/domain/model/notification.entity';
import {TrackingApi} from '@tracking/infrastructure/tracking-api';
import {retry} from 'rxjs';

/**
 * A service that manages the state of notifications using Angular signals.
 * It provides methods to load, add, update, and delete notifications,
 * as well as computed properties for notification count and loading/error states.
 */
@Injectable({
  providedIn: 'root',
})
export class TrackingStore {
  /**
   * Signal to hold the list of notifications.
   * @private
   */
  private readonly notificationsSignal = signal<Notification[]>([]);

  /**
   * Readonly signal for notifications.
   */
  readonly notifications = this.notificationsSignal.asReadonly();

  /**
   * Signal to indicate loading state.
   * @private
   */
  private readonly loadingSignal = signal<boolean>(false);
  /**
   * Readonly signal for loading state.
   */
  readonly loading = this.loadingSignal.asReadonly();

  /**
   * Signal to hold error messages.
   * @private
   */
  private readonly errorSignal = signal<string | null>(null);
  /**
   * Readonly signal for error messages.
   */
  readonly error = this.errorSignal.asReadonly();

  /**
   * Computed signal for the count of notifications.
   */
  readonly notificationCount = computed(() => this.notifications.length);

  /**
   * Constructor for TrackingStore.
   * @param trackingApi - An instance of TrackingApi to interact with the backend API.
   */
  constructor(private trackingApi: TrackingApi) {
    this.loadNotifications();
  }

  /**
   * Get a notification by its ID.
   * @param id - The ID of the notification to retrieve.
   * @returns A computed signal that resolves to the notification with the given ID, or undefined if not found.
   */
  getNotificationById(id: string | null | undefined): Signal<Notification | undefined> {
    return computed(() => this.notifications().find(n => n.id === id) || undefined);
  }

  /**
   * Add a new notification.
   * @param notification - The notification to add.
   */
  addNotification(notification: Notification): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.trackingApi.createNotification(notification).pipe(retry(2)).subscribe({
      next: (newNotification) => {
        this.notificationsSignal.update((notifications) => [...notifications, newNotification]);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err,'Failed to add notification'));
        this.loadingSignal.set(false);
      },
    })
  }

  /**
   * Update an existing notification.
   * @param notification - The notification to update.
   */
  updateNotification(notification: Notification): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.trackingApi.updateNotification(notification).pipe(retry(2)).subscribe({
      next: (updatedNotification) => {
        this.notificationsSignal.update((notifications) => notifications.map(n => n.id === updatedNotification.id ? updatedNotification : n));
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err,'Failed to update notification'));
        this.loadingSignal.set(false);
      },
    })
  }

  /**
   * Delete a notification by its ID.
   * @param id - The ID of the notification to delete.
   */
  deleteNotification(id: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.trackingApi.deleteNotification(id).pipe(retry(2)).subscribe({
      next: () => {
        this.notificationsSignal.update((notifications) => notifications.filter(n => n.id !== id));
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err,'Failed to delete notification'));
        this.loadingSignal.set(false);
      },
    })
  }

  /**
   * Load notifications from the API and update the state.
   * @private
   */
  private loadNotifications(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.trackingApi.getNotifications().pipe(retry(2)).subscribe({
      next: (notifications) => {
        this.notificationsSignal.set(notifications);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err,'Failed to load notifications'));
        this.loadingSignal.set(false);
      },
    });
  }

  /**
   * Format error messages for better readability.
   * @param error - The error object to format.
   * @param fallback - A fallback message to use if the error cannot be formatted.
   * @private
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
