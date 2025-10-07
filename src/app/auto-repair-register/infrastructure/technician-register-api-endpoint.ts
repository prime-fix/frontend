import { Injectable } from '@angular/core';
import { BaseApiEndpoint } from '@shared/infrastructure/http/base-api-endpoint';
import { TechnicianRegister } from '../domain/model/technician-register.entity';
import { TechnicianRegisterResponse, TechnicianRegisterResource } from './technician-register-response';
import { TechnicianRegisterAssembler } from './technician-register-assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class TechnicianRegisterApiEndpoint extends BaseApiEndpoint<
  TechnicianRegister,
  TechnicianRegisterResource,
  TechnicianRegisterResponse,
  TechnicianRegisterAssembler
> {
  protected readonly idQueryParamKey = 'id_technician';

  constructor(http: HttpClient) {
    const baseUrl = `${environment.primeFixProviderApiBaseUrl}${environment.primeFixProviderTechnicianRegisterEndpointPath}`;
    console.log('Technician API Base URL:', baseUrl);
    super(http, baseUrl, new TechnicianRegisterAssembler(), {
      usePathParams: false
    });
  }
}
