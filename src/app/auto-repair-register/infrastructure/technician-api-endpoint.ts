import {Injectable} from '@angular/core';
import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';
import {Technician} from '@register/domain/model/technician.entity';
import {TechnicianResource, TechnicianResponse} from '@register/infrastructure/technician-response';
import {TechnicianAssembler} from '@register/infrastructure/technician-assembler';

@Injectable({
  providedIn: 'root'
})
/**
 * API endpoint for managing Technicians.
 */
export class TechnicianApiEndpoint extends BaseApiEndpoint<
  Technician,
  TechnicianResource,
  TechnicianResponse,
  TechnicianAssembler
> {
  /**
   * The query parameter key used to identify the technician ID in API requests.
   * @protected
   */
  protected readonly idQueryParamKey = environment.technicianIdQueryParamKey

  /**
   * Constructs a new instance of the TechnicianApiEndpoint.
   * @param http - The HttpClient used for making HTTP requests.
   */
  constructor(http: HttpClient) {
    const baseUrl = `${environment.primeFixProviderApiBaseUrl}${environment.primeFixProviderTechniciansEndpointPath}`;
    console.log('Technician API Base URL:', baseUrl);
    super(http, baseUrl, new TechnicianAssembler(), {
      usePathParams: environment.usePathParams
    });
  }
}
