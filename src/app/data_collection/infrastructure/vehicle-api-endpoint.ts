import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {Vehicle} from '../domain/model/vehicle.entity';
import {VehicleResource, VehiclesResponse} from './vehicle-response';
import {VehicleAssembler} from './vehicle-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

export class VehicleApiEndpoint extends BaseApiEndpoint<Vehicle,VehicleResource,VehiclesResponse,VehicleAssembler>{
  protected readonly idQueryParamKey: string = environment.registeredVehicleIdQueryParamKey;

  constructor(http:HttpClient){
    super(http,`${environment.primeFixProviderApiBaseUrl}${environment.primeFixProviderVehiclesEndpointPath}`,
      new VehicleAssembler(),{ usePathParams: environment.usePathParams });
  }
}
