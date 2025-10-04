import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {UserAccount} from '@iam/domain/model/user-account.entity';
import {UserAccountResource, UserAccountResponse} from '@iam/infrastructure/api/user-account-response';
import {UserAccountAssembler} from '@iam/infrastructure/api/user-account-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

export class UserAccountsApiEndpoint extends BaseApiEndpoint<UserAccount, UserAccountResource, UserAccountResponse, UserAccountAssembler>{
  protected readonly idQueryParamKey: string = environment.userAccountIdQueryParamKey;

  constructor(http: HttpClient) {
    super(http, `${environment.primeFixProviderApiBaseUrl}${environment.primeFixProviderUserAccountsEndpoint}`,
      new UserAccountAssembler(), { usePathParams: environment.usePathParams });
  }
}
