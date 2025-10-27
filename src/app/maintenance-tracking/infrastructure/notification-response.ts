import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Response structure for notifications API.
 */
export interface NotificationResponse extends BaseResponse {
  /**
   * Array of notification resources.
   */
  notifications: NotificationResource[];
}

/**
 * Resource structure for a notification.
 */
export interface NotificationResource extends BaseResource {
  /**
   * Unique identifier for the notification.
   */
  id_notification: string;
  /**
   * Message content of the notification.
   */
  message: string;
  /**
   * Read status of the notification.
   */
  read: boolean;
  /**
   * Identifier of the associated vehicle.
   */
  id_vehicle: string;
  /**
   * Timestamp when the notification was sent.
   */
  sent: Date;
  /**
   * Identifier of the associated diagnostic.
   */
  id_diagnostic: string;
}
