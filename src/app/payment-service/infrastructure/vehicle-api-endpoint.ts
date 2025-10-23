import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {Vehicle} from '../domain/model/vehicle.entity';
import {VehicleResource, VehicleResponse} from './vehicle-response';
import {VehicleAssembler} from './vehicle-assembler';
import {environment} from '@env/environment';
import {HttpClient} from '@angular/common/http';

export class VehicleApiEndpoint extends BaseApiEndpoint<Vehicle, VehicleResource, VehicleResponse, VehicleAssembler>{
  /**
   * Key for the payment ID query parameter.
   * @protected
   */
  protected readonly idQueryParamKey: string = environment.registeredVehicleIdQueryParamKey;

  /**
   * Constructor for VehicleApiEndpoint.
   * @param http - The HttpClient instance to use for HTTP requests.
   */
  constructor(http: HttpClient) {
    super(http, `${environment.primeFixProviderApiBaseUrl}${environment.primeFixProviderRegisteredVehiclesEndpointPath}`,
      new VehicleAssembler(), { usePathParams: environment.usePathParams });
  }
}
