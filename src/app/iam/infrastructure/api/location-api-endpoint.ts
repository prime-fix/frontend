import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {Location} from '@iam/domain/model/location.entity';
import {LocationResource, LocationResponse} from '@iam/infrastructure/api/location-response';
import {LocationAssembler} from '@iam/infrastructure/api/location-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

/**
 * API endpoint for managing locations.
 */
export class LocationApiEndpoint extends BaseApiEndpoint<Location, LocationResource, LocationResponse, LocationAssembler>{
  /**
   * The query parameter key used to identify the location ID in API requests.
   * @protected
   */
  protected readonly idQueryParamKey: string = environment.locationIdQueryParamKey;

  /**
   * Constructs a new instance of the LocationApiEndpoint.
   * @param http - The HttpClient used for making HTTP requests.
   */
  constructor(http: HttpClient) {
    super(http, `${environment.primeFixProviderApiBaseUrl}${environment.primeFixProviderLocationsEndpointPath}`,
      new LocationAssembler(), { usePathParams: environment.usePathParams });
  }
}
