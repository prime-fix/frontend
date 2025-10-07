import { BaseApiEndpoint } from '@shared/infrastructure/http/base-api-endpoint';
import { TechnicianRegister } from '../domain/model/technician-register.entity';
import { TechnicianRegisterResponse, TechnicianRegisterResource } from './technician-register-response';
import { TechnicianRegisterAssembler } from './technician-register-assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { BaseApiConfig } from '@shared/infrastructure/http/base-api-config';

/**
 * API endpoint class for managing Technician Register requests.
 */
export class TechnicianRegisterApiEndpoint extends BaseApiEndpoint<
  TechnicianRegister,
  TechnicianRegisterResource,
  TechnicianRegisterResponse,
  TechnicianRegisterAssembler
> {
  /** Key used for identifying the entity by ID in query parameters. */
  protected readonly idQueryParamKey = 'id_technician';

  /**
   * Creates an instance of TechnicianRegisterApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.primeFixProviderApiBaseUrl}${environment.primeFixProviderTechnicianRegisterEndpointPath}`,
      new TechnicianRegisterAssembler(),
      {
        usePathParams: false
      }
    );
  }
}
