import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

export interface VehiclesResponse extends BaseResponse{
  vehicles: VehicleResource[];
}

/**
 * Represent the API resource for a Vehicle_Registered
 */
export interface VehicleResource extends BaseResource {
  id_vehicle:number;
  color:string;
  model:string;
  id_user:number;
  vehicle_brand:string;
  vehicle_plate:string;
  vehicle_type:string;
}
