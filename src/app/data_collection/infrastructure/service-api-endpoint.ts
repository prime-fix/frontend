import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {MainService} from '../domain/model/service.entity';
import {MaintenanceServiceResource, MaintenanceServiceResponse} from './service-response';
import {ServiceAssembler} from './service-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

export class ServiceApiEndpoint extends BaseApiEndpoint<MainService,MaintenanceServiceResource,MaintenanceServiceResponse,ServiceAssembler>{
  protected readonly idQueryParamKey: string = environment.serviceIdQueryParamKey;

  constructor(http:HttpClient){
    super(http,`${environment.primeFixProviderApiBaseUrl}${environment.primeFixProviderServicesEndpointPath}`,
      new ServiceAssembler(), { usePathParams: environment.usePathParams });
  }

}
