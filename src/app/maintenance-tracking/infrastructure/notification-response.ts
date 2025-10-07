import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Response structure for notifications API.
 */
export interface NotificationResponse extends BaseResponse {
  notifications: NotificationResource[];
}

/**
 * Resource structure for a notification.
 */
export interface NotificationResource extends BaseResource {
  id_notification: string;
  message: string;
  read: boolean;
  id_vehicle: string;
  sent: Date;
}
