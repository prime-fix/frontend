import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {Visit} from '../domain/model/visit.entity';
import {VisitResource, VisitResponse} from './visit-response';
import {VisitAssembler} from './visit-assembler';
import {environment} from '@env/environment';
import {HttpClient} from '@angular/common/http';

/**
 * API endpoint for managing Visit entities.
 */
export class VisitApiEndpoint extends BaseApiEndpoint<Visit, VisitResource, VisitResponse, VisitAssembler>{
  /**
   * Key for the visit ID query parameter.
   * @protected
   */
  protected readonly idQueryParamKey: string = environment.visitIdQueryParamKey;

  /**
   * Constructor for VisitApiEndpoint.
   * @param http - The HttpClient instance to use for HTTP requests.
   */
  constructor(http: HttpClient) {
    super(http, `${environment.primeFixProviderApiBaseUrl}${environment.primeFixVisitsEndpointPath}`,
      new VisitAssembler(), { usePathParams: environment.usePathParams });
  }
}
