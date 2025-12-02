import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {Rating} from '../domain/model/rating.entity';
import {RatingResource, RatingResponse} from './rating-response';
import {RatingAssembler} from './rating-assembler';
import {environment} from '@env/environment';
import {HttpClient} from '@angular/common/http';

/**
 * API endpoint for managing Rating entities.
 */
export class RatingApiEndpoint  extends BaseApiEndpoint<Rating, RatingResource, RatingResponse, RatingAssembler>{
  /**
   * Key for the rating ID query parameter.
   * @protected
   */
  protected readonly idQueryParamKey: string = environment.ratingIdQueryParamKey;

  /**
   * Constructor for RatingApiEndpoint.
   * @param http - The HttpClient instance to use for HTTP requests.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.primeFixProviderApiBaseUrlAWS}${environment.primeFixProviderRatingsEndpointPath}`,
      new RatingAssembler(),
      {
        usePathParams: environment.usePathParams,
        enableFallback: true,
        primaryBaseUrl: environment.primeFixProviderApiBaseUrlAWS,
        fallbackBaseUrl: environment.primeFixProviderApiBaseUrlSupabase
      }
    );
  }
}
