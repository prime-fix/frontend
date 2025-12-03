import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {Service} from '../domain/model/service.entity';
import {MaintenanceServiceResource, MaintenanceServiceResponse} from './service-response';
import {ServiceAssembler} from './service-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

/**
 * API endpoint for managing Services.
 */
export class ServiceApiEndpoint extends BaseApiEndpoint<Service,MaintenanceServiceResource,MaintenanceServiceResponse,ServiceAssembler>{
  /**
   * Constructs a new instance of the ServiceApiEndpoint.
   * @param http - The HttpClient used for making HTTP requests.
   */
  constructor(http:HttpClient){
    super(
      http,
      `${environment.primeFixProviderApiBaseUrlAWS}${environment.primeFixProviderServicesEndpointPath}`,
      new ServiceAssembler(),
      {
        usePathParams: environment.usePathParams,
        enableFallback: true,
        primaryBaseUrl: environment.primeFixProviderApiBaseUrlAWS,
        fallbackBaseUrl: environment.primeFixProviderApiBaseUrlSupabase
      }
    );
  }
}
