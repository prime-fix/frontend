import { BaseApiEndpoint } from '../../shared/infrastructure/http/base-api-endpoint';
import { AutoRepair } from '../domain/model/auto-repair.entity';
import { AutoRepairResource, AutoRepairsResponse } from './auto-repairs-response';
import { AutoRepairAssembler } from './auto-repair-assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export class AutoRepairsApiEndpoint extends BaseApiEndpoint<
  AutoRepair,
  AutoRepairResource,
  AutoRepairsResponse,
  AutoRepairAssembler
> {
  /**
   * Creates an instance of AutoRepairsApiEndpoint.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderAutoRepairsEndpointPath}`,
      new AutoRepairAssembler()
    );
  }
}
