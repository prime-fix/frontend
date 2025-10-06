import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {Repair} from '../domain/model/auto-repair.entity';
import {RepairResource, AutoRepairResponse} from './auto-repair-response';
import {AutoRepairAssembler} from './auto-repair-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

export class AutoRepairApiEndpoint extends BaseApiEndpoint<Repair, RepairResource, AutoRepairResponse, AutoRepairAssembler>{

  protected readonly idQueryParamKey: string = environment.autoRepairIdQueryParamKey;

  constructor(http: HttpClient) {

    super(
      http,`${environment.primeFixProviderApiBaseUrl}${environment.primeFixProviderAutoRepairsEndpointPath}`,
      new AutoRepairAssembler(), { usePathParams: environment.usePathParams });
  }
}
