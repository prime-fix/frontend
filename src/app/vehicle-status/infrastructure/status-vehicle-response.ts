import {BaseResponse, BaseResource} from '@shared/infrastructure/http/base-response';

/**
 * Represents the API response structure for a list of status.
 */
export interface StatusVehicleResponse extends BaseResponse {
  /**
   * The list of status returned by the API.
   */
  categories: StatusVehicleResource[];
}

export interface StatusVehicleResource extends BaseResource {
  id: number,
  vehicle: string,
  license_plate: string,
  owner: string,
  status: string,
  diagnostic: string,
  price: number
}
