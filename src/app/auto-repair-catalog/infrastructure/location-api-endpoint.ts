import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {Location} from '@catalog/domain/model/location.entity';
import {LocationResource, LocationResponse} from '@catalog/infrastructure/location-response';
import {LocationAssembler} from '@catalog/infrastructure/location-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

/**
 * API endpoint for managing locations.
 */
export class LocationApiEndpoint extends BaseApiEndpoint<Location, LocationResource, LocationResponse, LocationAssembler>{
  /**
   * Constructs a new instance of the LocationApiEndpoint.
   * @param http - The HttpClient used for making HTTP requests.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.primeFixProviderApiBaseUrlAWS}${environment.primeFixProviderLocationsEndpointPath}`,
      new LocationAssembler(),
      {
        usePathParams: environment.usePathParams,
        enableFallback: true,
        primaryBaseUrl: environment.primeFixProviderApiBaseUrlAWS,
        fallbackBaseUrl: environment.primeFixProviderApiBaseUrlSupabase
      }
    );
  }
}
