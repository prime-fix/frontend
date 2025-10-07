import { BaseApiEndpoint } from '@shared/infrastructure/http/base-api-endpoint';
import { AutoRepairRegister } from '../domain/model/auto-repair-register.entity';
import { AutoRepairRegisterResponse, AutoRepairRegisterResource } from './auto-repair-register-response';
import { AutoRepairRegisterAssembler } from './auto-repair-register-assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { BaseApiConfig } from '@shared/infrastructure/http/base-api-config';

/**
 * API endpoint class for AutoRepairRegister operations.
 */
export class AutoRepairRegisterApiEndpoint extends BaseApiEndpoint<
  AutoRepairRegister,
  AutoRepairRegisterResource,
  AutoRepairRegisterResponse,
  AutoRepairRegisterAssembler
> {
  /** Key used for identifying the entity by ID in query parameters. */
  protected readonly idQueryParamKey = 'id';

  constructor(http: HttpClient) {
    super(
      http,
      `${environment.primeFixProviderApiBaseUrl}${environment.primeFixProviderAutoRepairRegisterEndpointPath}`,
      new AutoRepairRegisterAssembler(),
      {
        usePathParams: false
      }
    );
  }
}

