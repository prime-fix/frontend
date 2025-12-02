import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Represents the response structure for Maintenance Service API calls.
 */
export interface MaintenanceServiceResponse extends BaseResponse{
  /**
   * List of Maintenance Service resources.
   */
  services: MaintenanceServiceResource[];
}

/**
 * Represents a Maintenance Service resource.
 */
export interface MaintenanceServiceResource extends BaseResource{
  /**
   * The unique identifier for the service.
   */
  id:number;
  /**
   * The name of the service.
   */
  name:string;
  /**
   * The description of the service.
   */
  description:string;
}
