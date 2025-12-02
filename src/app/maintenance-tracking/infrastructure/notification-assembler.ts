import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {Notification} from '@tracking/domain/model/notification.entity';
import {NotificationResource, NotificationResponse} from '@tracking/infrastructure/notification-response';

/**
 * Assembler for converting between Notification entities and their corresponding resources.
 */
export class NotificationAssembler implements BaseAssembler<Notification, NotificationResource, NotificationResponse> {

  /**
   * Converts a NotificationResponse to an array of Notification entities.
   * @param response - The response to be converted.
   * @return The array of converted entities.
   */
  toEntitiesFromResponse(response: NotificationResponse): Notification[] {
    return response.notifications.map(resource => this.toEntityFromResource(resource as NotificationResource));
  }

  /**
   * Converts a NotificationResource to a Notification entity.
   * @param resource - The resource to be converted.
   * @return The converted entity.
   */
  toEntityFromResource(resource: NotificationResource): Notification {
    return new Notification({
      id: resource.id,
      message: resource.message,
      read: resource.read,
      vehicle_id: resource.vehicle_id,
      sent: resource.sent,
    })
  }

  /**
   * Converts a Notification entity to a NotificationResource.
   * @param entity - The entity to be converted.
   * @return The converted resource.
   */
  toResourceFromEntity(entity: Notification): NotificationResource {
    return {
      id: entity.id,
      message: entity.message,
      read: entity.read,
      vehicle_id: entity.vehicle_id,
      sent: entity.sent,
    } as NotificationResource;
  }
}
