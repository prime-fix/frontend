import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {Visit} from '../domain/model/visit.entity';
import {VisitResource, VisitsResponse} from './visit-response';
import {VisitAssembler} from './visit-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

/**
 * API endpoint for managing Visits.
 */
export class VisitApiEndpoint extends BaseApiEndpoint<Visit,VisitResource,VisitsResponse,VisitAssembler> {
  /**
   * The query parameter key used to identify the visit ID in API requests.
   * @protected
   */
  protected readonly idQueryParamKey:string = environment.visitIdQueryParamKey;

  /**
   * Constructs a new instance of the VisitApiEndpoint.
   * @param http
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.primeFixProviderApiBaseUrlAWS}${environment.primeFixVisitsEndpointPath}`,
      new VisitAssembler(),
      {
        usePathParams: environment.usePathParams,
        enableFallback: true,
        primaryBaseUrl: environment.primeFixProviderApiBaseUrlAWS,
        fallbackBaseUrl: environment.primeFixProviderApiBaseUrlSupabase
      }
    );
  }
}
