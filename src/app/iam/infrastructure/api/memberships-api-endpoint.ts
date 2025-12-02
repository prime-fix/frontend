import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {Membership} from '@iam/domain/model/membership.entity';
import {MembershipResource, MembershipResponse} from '@iam/infrastructure/api/membership-response';
import {MembershipAssembler} from '@iam/infrastructure/api/membership-assembler';
import {environment} from '@env/environment';
import {HttpClient} from '@angular/common/http';

/**
 * API endpoint for managing memberships.
 */
export class MembershipsApiEndpoint extends BaseApiEndpoint<Membership, MembershipResource, MembershipResponse, MembershipAssembler> {

  /**
   * Key used for identifying membership ID in query parameters.
   * @protected
   */
  protected readonly idQueryParamKey: string = environment.membershipIdQueryParamKey;

  /**
   * Constructs the MembershipsApiEndpoint.
   * @param http - The HttpClient for making HTTP requests.
   */
  constructor(http: HttpClient)  {
    super(
      http,
      `${environment.primeFixProviderApiBaseUrlAWS}${environment.primeFixProviderMembershipsEndpointPath}`,
      new MembershipAssembler(),
      {
        usePathParams: environment.usePathParams,
        enableFallback: true,
        primaryBaseUrl: environment.primeFixProviderApiBaseUrlAWS,
        fallbackBaseUrl: environment.primeFixProviderApiBaseUrlSupabase
      }
    );
  }
}
