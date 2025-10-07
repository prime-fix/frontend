import { BaseResponse, BaseResource } from '../../shared/infrastructure/http/base-response';

/**
 * Represents the API response structure for a list of locations.
 */
export interface LocationsResponse extends BaseResponse {
  /**
   * The list of locations returned by the API.
   */
  locations: LocationResource[];
}
/**
 * Represents the API resource/DTO for a location.
 */
export interface LocationResource extends BaseResource {
  id: number;
  address: string;
  district: string;
  department: string;
}
