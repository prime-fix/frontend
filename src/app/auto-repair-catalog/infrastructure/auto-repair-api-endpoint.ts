import { BaseApiEndpoint } from '@shared/infrastructure/http/base-api-endpoint';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import {AutoRepair} from '@catalog/domain/model/auto-repair.entity';
import {AutoRepairResource, AutoRepairResponse} from '@catalog/infrastructure/auto-repair-response';
import {AutoRepairAssembler} from '@catalog/infrastructure/auto-repair-assembler';

/**
 * API endpoint for managing Auto Repairs.
 */
export class AutoRepairApiEndpoint extends BaseApiEndpoint<
  AutoRepair,
  AutoRepairResource,
  AutoRepairResponse,
  AutoRepairAssembler
> {

  /**
   * The query parameter key used to identify the auto repair ID in API requests.
   * @protected
   */
  protected readonly idQueryParamKey = environment.autoRepairIdQueryParamKey;

  /**
   * Constructs a new instance of the AutoRepairApiEndpoint.
   * @param http - The HttpClient used for making HTTP requests.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.primeFixProviderApiBaseUrlAWS}${environment.primeFixProviderAutoRepairsEndpointPath}`,
      new AutoRepairAssembler(),
      {
        usePathParams: environment.usePathParams,
        enableFallback: true,
        primaryBaseUrl: environment.primeFixProviderApiBaseUrlAWS,
        fallbackBaseUrl: environment.primeFixProviderApiBaseUrlSupabase
      }
    );
  }
}

