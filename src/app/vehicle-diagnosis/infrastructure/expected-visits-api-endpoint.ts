import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {ExpectedVisit} from '@diagnosis/domain/model/expected-visit.entity';
import {ExpectedVisitResource, ExpectedVisitResponse} from '@diagnosis/infrastructure/expected-visit-response';
import {ExpectedVisitAssembler} from '@diagnosis/infrastructure/expected-visit-assembler';
import {environment} from '@env/environment';
import {HttpClient} from '@angular/common/http';

/**
 * API endpoint for managing expected visits.
 */
export class ExpectedVisitsApiEndpoint extends BaseApiEndpoint<ExpectedVisit, ExpectedVisitResource, ExpectedVisitResponse, ExpectedVisitAssembler> {
  /**
   * Constructor for ExpectedVisitsApiEndpoint.
   * @param http - The HttpClient instance for making HTTP requests.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.primeFixProviderApiBaseUrlAWS}${environment.primeFixExpectedVisitsEndpointPath}`,
      new ExpectedVisitAssembler(),
      {
        usePathParams: environment.usePathParams,
        enableFallback: true,
        primaryBaseUrl: environment.primeFixProviderApiBaseUrlAWS,
        fallbackBaseUrl: environment.primeFixProviderApiBaseUrlSupabase
      }
    );
  }
}
