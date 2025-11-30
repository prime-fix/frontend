import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {ServiceOffer} from '@catalog/domain/model/service-offer.entity';
import {ServiceOfferResource, ServiceOfferResponse} from '@catalog/infrastructure/service-offer-response';
import {ServiceOfferAssembler} from '@catalog/infrastructure/service-offer-assembler';
import {environment} from '@env/environment';
import {HttpClient} from '@angular/common/http';

/**
 * API endpoint for managing ServiceOffer
 */
export class ServiceOfferApiEndpoint extends BaseApiEndpoint<ServiceOffer, ServiceOfferResource, ServiceOfferResponse, ServiceOfferAssembler>{

  /**
   * The query parameter key to identity the service offer ID in API request
   * @protected
   */
  protected readonly idQueryParamKey:string = environment.serviceOfferIdQueryParamKey;

  /**
   * Constructs a new instance of the ServiceOfferApiEndpoint
   * @param http
   */
  constructor(http:HttpClient) {
    super(http, `${environment.primeFixProviderApiBaseUrl}${environment.primeFixProviderServiceOfferEndpointPath}`,
          new ServiceOfferAssembler(),{usePathParams:environment.usePathParams}
      );
  }


}
