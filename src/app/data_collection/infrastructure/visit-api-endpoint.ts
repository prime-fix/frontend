import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {Visit} from '../domain/model/visit.entity';
import {VisitResource, VisitsResponse} from './visit-response';
import {VisitAssembler} from './visit-assembler';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '@env/environment';


export class VisitApiEndpoint extends BaseApiEndpoint<Visit,VisitResource,VisitsResponse,VisitAssembler> {
  protected readonly idQueryParamKey:string = environment.visitIdQueryParamKey;

  constructor(http: HttpClient) {

    super(http, `${environment.primeFixProviderApiBaseUrl}${environment.primeFixVisitsEndpointPath}`,
      new VisitAssembler(),{ usePathParams: environment.usePathParams}
    );
  }
}
