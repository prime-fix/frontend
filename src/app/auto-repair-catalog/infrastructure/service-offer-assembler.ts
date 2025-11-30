import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {ServiceOffer} from '@catalog/domain/model/service-offer.entity';
import {ServiceOfferResource, ServiceOfferResponse} from '@catalog/infrastructure/service-offer-response';

/**
 * Assembler for converting between ServiceOffer entities and resources
 */
export class ServiceOfferAssembler implements BaseAssembler<ServiceOffer, ServiceOfferResource, ServiceOfferResponse>{

  /**
   * Converts a ServiceOfferResponse to an array of Visit entities.
   * @param response - The Service Offer Response to convert.
   * @returns An array of ServiceOffer entities.
   */
  toEntitiesFromResponse(response:ServiceOfferResponse):ServiceOffer[]{
    return response.servicesOffer.map(resource => this.toEntityFromResource(resource as ServiceOfferResource));
  }

  /**
   * Converts a Service Offer Resource to a ServiceOffer entity
   * @param resource - The Service Offer Resource to convert
   */
  toEntityFromResource(resource: ServiceOfferResource): ServiceOffer {
    return new ServiceOffer({
      service_offer_id: resource.service_offer_id,
      id_service: resource.id_service,
      id_auto_repair: resource.id_auto_repair,
      price:resource.price,
      is_active:resource.is_active,
      duration_hour:resource.duration_hour
    });
  }

  toDomainModelList(resources: ServiceOfferResource[]): ServiceOffer[] {
    return resources.map(resource => this.toEntityFromResource(resource));
  }

  /**
   * Converts a Service Offer entity to a ServiceOffer Resource
   * @param entity - The service Offer entity to convert
   */
  toResourceFromEntity(entity: ServiceOffer): ServiceOfferResource {
    return {
      service_offer_id:entity.id,
      id_service:entity.service_id,
      id_auto_repair:entity.auto_repair_id,
      price:entity.price,
      is_active:entity.is_active,
      duration_hour:entity.duration_hour
    } as ServiceOfferResource;
  }
}
