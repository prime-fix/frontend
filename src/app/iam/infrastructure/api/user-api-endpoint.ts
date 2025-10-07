import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {User} from '@iam/domain/model/user.entity';
import {UserResource, UserResponse} from '@iam/infrastructure/api/user-response';
import {UserAssembler} from '@iam/infrastructure/api/user-assembler';
import {environment} from '@env/environment';
import {HttpClient} from '@angular/common/http';

/**
 * User API endpoint.
 */
export class UserApiEndpoint extends BaseApiEndpoint<User, UserResource, UserResponse, UserAssembler>{
  /**
   * The query parameter key for user ID.
   * @protected
   */
  protected readonly idQueryParamKey: string = environment.userIdQueryParamKey;

  /**
   * Constructor of the UserApiEndpoint.
   * @param http - The HTTP client.
   */
  constructor(http: HttpClient) {
    super(http, `${environment.primeFixProviderApiBaseUrl}${environment.primeFixProviderUsersEndpointPath}`,
      new UserAssembler(), { usePathParams: environment.usePathParams });
  }
}
