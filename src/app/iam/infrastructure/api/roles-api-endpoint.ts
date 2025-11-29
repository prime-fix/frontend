import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {Role} from '@iam/domain/model/role.entity';
import {RoleResource, RoleResponse} from '@iam/infrastructure/api/role-response';
import {RoleAssembler} from '@iam/infrastructure/api/role-assembler';
import {environment} from '@env/environment';
import {HttpClient} from '@angular/common/http';

/**
 * Role API endpoint.
 */
export class RolesApiEndpoint extends BaseApiEndpoint<Role, RoleResource, RoleResponse, RoleAssembler> {
  /**
   * The query parameter key for role ID.
   * @protected
   */
  protected readonly idQueryParamKey: string = environment.roleIdQueryParamKey;

  /**
   * Constructor of the RolesApiEndpoint.
   * @param http - The HTTP client.
   */
  constructor(http: HttpClient) {
    super(http, `${environment.primeFixProviderApiBaseUrl}${environment.primeFixProviderRolesEndpointPath}`,
      new RoleAssembler(), { usePathParams: environment.usePathParams });
  }
}
