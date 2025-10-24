import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {StatusVehicle} from '../domain/model/status-vehicle.entity';
import {StatusVehicleResponse, StatusVehicleResource} from './status-vehicle-response';
import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {StatusVehicleAssembler} from './status-vehicle-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

export class StatusVehicleApiEndpoint extends BaseApiEndpoint<StatusVehicle, StatusVehicleResource, StatusVehicleResponse, StatusVehicleAssembler> {
  protected override idQueryParamKey: string = environment.registeredVehicleIdQueryParamKey;
  /**
   * Creates an instance of StatusVehicleApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(http, `${environment.primeFixProviderApiBaseUrl}${environment.primeFixProviderRegisteredVehiclesEndpointPath}`,
      new StatusVehicleAssembler(), { usePathParams: environment.usePathParams });
  }
}
