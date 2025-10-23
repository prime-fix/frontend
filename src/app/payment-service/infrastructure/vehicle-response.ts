import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Response interface for vehicle-related API responses.
 */
export interface VehicleResponse extends BaseResponse {
  vehicles: VehicleResource[];
}

/**
 * Resource interface representing a vehicle entity.
 */
export interface VehicleResource extends BaseResource {
  id_vehicle: string;
  model: string;
  id_user: string;
  vehicle_brand: string;
  vehicle_plate: string;
  vehicle_type: string;
  color: string;
}
