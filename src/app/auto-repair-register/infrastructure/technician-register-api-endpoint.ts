import { BaseApiEndpoint } from '@shared/infrastructure/http/base-api-endpoint';
import { TechnicianRegister } from '../domain/model/technician-register.entity';
import { TechnicianRegisterResponse, TechnicianRegisterResource } from './technician-register-response';
import { TechnicianRegisterAssembler } from './technician-register-assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

/**
 * API endpoint class for managing Technician Register requests.
 */
export class TechnicianRegisterApiEndpoint extends BaseApiEndpoint<
  TechnicianRegister,
  TechnicianRegisterResource,
  TechnicianRegisterResponse,
  TechnicianRegisterAssembler
> {
  /**
   * Creates an instance of TechnicianRegisterApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.primeFixProviderApiBaseUrl}${environment.primeFixProviderTechnicianRegisterEndpointPath}`,
      new TechnicianRegisterAssembler()
    );
  }
}
