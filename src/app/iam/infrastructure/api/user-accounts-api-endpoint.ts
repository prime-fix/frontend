import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {UserAccount} from '@iam/domain/model/user-account.entity';
import {UserAccountResource, UserAccountResponse} from '@iam/infrastructure/api/user-account-response';
import {UserAccountAssembler} from '@iam/infrastructure/api/user-account-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

/**
 * API endpoint for managing user accounts.
 */
export class UserAccountsApiEndpoint extends BaseApiEndpoint<UserAccount, UserAccountResource, UserAccountResponse, UserAccountAssembler>{
  /**
   * Constructor for UserAccountsApiEndpoint.
   * @param http - The HttpClient instance for making HTTP requests.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.primeFixProviderApiBaseUrlAWS}${environment.primeFixProviderUserAccountsEndpointPath}`,
      new UserAccountAssembler(),
      {
        usePathParams: environment.usePathParams,
        enableFallback: true,
        primaryBaseUrl: environment.primeFixProviderApiBaseUrlAWS,
        fallbackBaseUrl: environment.primeFixProviderApiBaseUrlSupabase
      }
    );
  }
}
