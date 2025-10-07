import { BaseApiEndpoint } from '../../shared/infrastructure/http/base-api-endpoint';
import { Technician } from '../domain/model/technician.entity';
import { TechnicianResource, TechniciansResponse } from './technicians-response';
import { TechnicianAssembler } from './technician-assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export class TechniciansApiEndpoint extends BaseApiEndpoint<
  Technician,
  TechnicianResource,
  TechniciansResponse,
  TechnicianAssembler
> {
  /**
   * Creates an instance of TechniciansApiEndpoint.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderTechniciansEndpointPath}`,
      new TechnicianAssembler()
    );
  }
}
