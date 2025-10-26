import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {Vehicle} from '@tracking/domain/model/vehicle.entity';
import {VehicleResource, VehiclesResponse} from './vehicle-response';
import {VehicleAssembler} from './vehicle-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

/**
 * API endpoint for managing Vehicles.
 */
export class VehicleApiEndpoint extends BaseApiEndpoint<Vehicle,VehicleResource,VehiclesResponse,VehicleAssembler>{
  /**
   * The query parameter key used to identify the vehicle ID in API requests.
   * @protected
   */
  protected readonly idQueryParamKey: string = environment.registeredVehicleIdQueryParamKey;

  /**
   * Constructs a new instance of the VehicleApiEndpoint.
   * @param http - The HttpClient used for making HTTP requests.
   */
  constructor(http:HttpClient){
    super(http,`${environment.primeFixProviderApiBaseUrl}${environment.primeFixProviderVehiclesEndpointPath}`,
      new VehicleAssembler(),{ usePathParams: environment.usePathParams });
  }
}
