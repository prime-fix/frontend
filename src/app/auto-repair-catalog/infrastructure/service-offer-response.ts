import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Represents the API response for ServiceOffer
 */
export interface ServiceOfferResponse extends BaseResponse{
  servicesOffer:ServiceOfferResource[];
}

/**
 * Represents the API resource for a serviceOffer
 */
export interface  ServiceOfferResource extends BaseResource{

  /**
   * The unique identifier for the visit offer
   */
  service_offer_id:string;
  /**
   * The unique identifier for service
   */
  id_service:string;
  /**
   * The unique identifier for auto repair
   */
  id_auto_repair:string;
  /**
   * The price
   */
  price:number;
  /**
   * The state of service
   */
  is_active:boolean;
  /**
   * The duration of the service
   */
  duration_hour:number;

}
