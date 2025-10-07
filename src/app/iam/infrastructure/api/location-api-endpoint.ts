import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {Location} from '@iam/domain/model/location.entity';
import {LocationResource, LocationResponse} from '@iam/infrastructure/api/location-response';
import {LocationAssembler} from '@iam/infrastructure/api/location-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

export class LocationApiEndpoint extends BaseApiEndpoint<Location, LocationResource, LocationResponse, LocationAssembler>{
  protected readonly idQueryParamKey: string = environment.locationIdQueryParamKey;

  constructor(http: HttpClient) {
    super(http, `${environment.primeFixProviderApiBaseUrl}${environment.primeFixProviderLocationsEndpointPath}`,
      new LocationAssembler(), { usePathParams: environment.usePathParams });
  }
}
