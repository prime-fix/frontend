import {BaseApi} from '@shared/infrastructure/http/base-api';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Notification} from '@tracking/domain/model/notification.entity';
import {NotificationApiEndpoint} from '@tracking/infrastructure/notification-api-endpoint';
import {Injectable} from '@angular/core';

/**
 * API for managing tracking-related operations.
 */
@Injectable({
  providedIn: 'root'
})
export class TrackingApi extends BaseApi {
  /**
   * The notifications API endpoint.
   * @private - Indicates that this property is private and should not be accessed directly from outside the class.
   */
  private readonly notificationsEndpoint: NotificationApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.notificationsEndpoint = new NotificationApiEndpoint(http);
  }

  /**
   * Fetches all notifications.
   * @returns An observable that emits an array of notifications.
   */
  getNotifications(): Observable<Notification[]> {
    return this.notificationsEndpoint.getAll();
  }

  /**
   * Fetches a notification by its ID.
   * @param id - The ID of the notification to fetch.
   * @returns An observable that emits the notification with the specified ID.
   */
  getNotification(id: string): Observable<Notification> {
    return this.notificationsEndpoint.getById(id);
  }

  /**
   * Creates a new notification.
   * @param notification - The notification to create.
   * @returns An observable that emits the created notification.
   */
  createNotification(notification: Notification): Observable<Notification> {
    return this.notificationsEndpoint.create(notification);
  }

  /**
   * Updates an existing notification.
   * @param notification - The notification to update.
   * @returns An observable that emits the updated notification.
   */
  updateNotification(notification: Notification): Observable<Notification> {
    return this.notificationsEndpoint.update(notification, notification.id);
  }

  /**
   * Deletes a notification by its ID.
   * @param id - The ID of the notification to delete.
   * @returns An observable that completes when the notification is deleted.
   */
  deleteNotification(id: string): Observable<void> {
    return this.notificationsEndpoint.delete(id);
  }
}
