import { BaseApiEndpoint } from '@shared/infrastructure/http/base-api-endpoint';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import {AutoRepair} from '@catalog/domain/model/auto-repair.entity';
import {AutoRepairResource, AutoRepairResponse} from '@catalog/infrastructure/auto-repair-response';
import {AutoRepairAssembler} from '@catalog/infrastructure/auto-repair-assembler';
import {Observable, take} from 'rxjs';
import {ServiceOffer} from '@catalog/domain/model/service-offer.entity';
import {ServiceOfferAssembler} from '@catalog/infrastructure/service-offer-assembler';
import {ServiceOfferResource} from '@catalog/infrastructure/service-offer-response';
import {map} from 'rxjs/operators';

/**
 * API endpoint for managing Auto Repairs.
 */
export class AutoRepairApiEndpoint extends BaseApiEndpoint<
  AutoRepair,
  AutoRepairResource,
  AutoRepairResponse,
  AutoRepairAssembler
> {

  /**
   * The query parameter key used to identify the auto repair ID in API requests.
   * @protected
   */
  protected readonly idQueryParamKey = environment.autoRepairIdQueryParamKey;

  private readonly offerAssembler : ServiceOfferAssembler;
  private readonly offerCollectionPath: string ="service_offer";
  /**
   * Constructs a new instance of the AutoRepairApiEndpoint.
   * @param http - The HttpClient used for making HTTP requests.
   */
  constructor(http: HttpClient) {
    super(
      http,
      `${environment.primeFixProviderApiBaseUrl}${environment.primeFixProviderAutoRepairsEndpointPath}`,
      new AutoRepairAssembler(), { usePathParams: environment.usePathParams }
    );
    this.offerAssembler = new ServiceOfferAssembler();
  }


  getOffers(autoRepairId: number | string): Observable<ServiceOffer[]> {
    const url =`${environment.primeFixProviderApiBaseUrl}` + `${environment.primeFixProviderServiceOfferEndpointPath}` + `?id_auto_repair=eq.${autoRepairId}`;

    return this.http.get<ServiceOfferResource[]>(url)
      .pipe(
        map(resources => this.offerAssembler.toDomainModelList(resources))
      );
  }

  addOffer(autoRepairId: number | string, payload: any): Observable<ServiceOffer> {
    const url = `${environment.primeFixProviderApiBaseUrl}` +
      `${environment.primeFixProviderServiceOfferEndpointPath}`;

    return this.http.post<ServiceOfferResource[]>(url, payload)
      .pipe(
        take(1),
        map(resources => {
          if (!resources || resources.length === 0) {
            throw new Error("Respuesta vacía o nula del servidor después de la inserción.");
          }
          const resource = resources[0];
          return this.offerAssembler.toEntityFromResource(resource);
        })
      );
  }

  deleteOffer(autoRepairId: number | string, serviceOfferId: number | string): Observable<void> {
    const url = `${environment.primeFixProviderApiBaseUrl}` + `${environment.primeFixProviderServiceOfferEndpointPath}` + `?service_offer_id=eq.${serviceOfferId}&id_auto_repair=eq.${autoRepairId}`;
    return this.http.delete<void>(url);
  }
}

