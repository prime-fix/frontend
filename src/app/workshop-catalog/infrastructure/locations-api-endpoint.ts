import { BaseApiEndpoint } from '../../shared/infrastructure/http/base-api-endpoint';
import { Location } from '../domain/model/location.entity';
import { LocationResource, LocationsResponse } from './locations-response';
import { LocationAssembler } from './location-assembler';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export class LocationsApiEndpoint extends BaseApiEndpoint<Location, LocationResource, LocationsResponse, LocationAssembler> {
  /**
   * Creates an instance of LocationsApiEndpoint.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.platformProviderApiBaseUrl}${environment.platformProviderLocationsEndpointPath}`,
      new LocationAssembler()
    );
  }
}
