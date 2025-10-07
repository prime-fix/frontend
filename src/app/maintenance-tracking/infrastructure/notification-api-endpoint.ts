import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {Notification} from '@tracking/domain/model/notification.entity';
import {NotificationResource, NotificationResponse} from '@tracking/infrastructure/notification-response';
import {NotificationAssembler} from '@tracking/infrastructure/notification-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

/**
 * API endpoint for managing notifications.
 */
export class NotificationApiEndpoint extends BaseApiEndpoint<Notification, NotificationResource, NotificationResponse, NotificationAssembler> {
  protected readonly idQueryParamKey: string = environment.notificationIdQueryParamKey;

  /**
   * Creates an instance of NotificationApiEndpoint.
   * @param http - The HTTP client to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(http, `${environment.primeFixProviderApiBaseUrl}${environment.primeFixProviderNotificationsEndpointPath}`,
      new NotificationAssembler(), { usePathParams: true });
  }
}
