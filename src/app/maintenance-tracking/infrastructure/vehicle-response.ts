import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Represent the API response for Vehicles
 */
export interface VehiclesResponse extends BaseResponse{
  /**
   * Array of Vehicle resources.
   */
  vehicles: VehicleResource[];
}

/**
 * Represent the API resource for a Vehicle_Registered
 */
export interface VehicleResource extends BaseResource {
  /**
   * Unique identifier for the vehicle.
   */
  id: number;
  /**
   * Color of the vehicle.
   */
  color:string;
  /**
   * Model of the vehicle.
   */
  model:string;
  /**
   * Identifier of the user associated with the vehicle.
   */
  user_id: number;
  /**
   * Brand of the vehicle.
   */
  vehicle_brand:string;
  /**
   * Plate number of the vehicle.
   */
  vehicle_plate:string;
  /**
   * Type of the vehicle.
   */
  vehicle_type: string;
  /**
   * State of the vehicle maintenance.
   */
  state_maintenance: number;
}
