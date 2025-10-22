import {Injectable} from '@angular/core';
import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {TechnicianSchedule} from '@register/domain/model/technician-schedule.entity';
import {
  TechnicianScheduleResource,
  TechnicianScheduleResponse
} from '@register/infrastructure/technician-schedule-response';
import {TechnicianScheduleAssembler} from '@register/infrastructure/technician-schedule-assembler';
import {environment} from '@env/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
/**
 * API endpoint for managing Technician Schedules.
 */
export class TechnicianScheduleApiEndpoint extends BaseApiEndpoint<
  TechnicianSchedule, TechnicianScheduleResource, TechnicianScheduleResponse, TechnicianScheduleAssembler>{

  /**
   * The query parameter key used to identify the technician schedule ID in API requests.
   * @protected
   */
  protected readonly idQueryParamKey = environment.technicianScheduleIdQueryParamKey;

  /**
   * Constructs a new instance of the TechnicianScheduleApiEndpoint.
   */
  constructor(http: HttpClient) {
    super(http,`${environment.primeFixProviderApiBaseUrl}${environment.primeFixProviderTechnicianSchedulesEndpointPath}`, new TechnicianScheduleAssembler(), {
      usePathParams: environment.usePathParams,
    });
  }
}
