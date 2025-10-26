import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Represent the API response for Visits
 */
export interface VisitsResponse extends BaseResponse{
  /**
   * Array of Visit resources.
   */
  visits:VisitResource[];
}

/**
 * Represent the API resource for a Visit
 */
export interface VisitResource extends BaseResource{
  /**
   * The unique identifier for the visit.
   */
  id_visit:number| string;
  /**
   * The description of the failure reported during the visit.
   */
  failure:string;
  /**
   * The unique identifier for the vehicle associated with the visit.
   */
  id_vehicle:number|string;
  /**
   * The date and time of the visit in string format.
   */
  time_visit:string;
  /**
   * The unique identifier for the auto repair associated with the visit.
   */
  id_auto_repair:number|string;
  /**
   * The unique identifier for the service associated with the visit.
   */
  id_service:number|string;
  /**
   * The status of the visit.
   */
  status:string
}
