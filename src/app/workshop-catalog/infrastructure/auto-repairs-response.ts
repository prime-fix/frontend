import { BaseResponse, BaseResource } from '../../shared/infrastructure/http/base-response';

export interface AutoRepairsResponse extends BaseResponse {
  /**
   * Array of auto repair resources included in the response.
   */
  autoRepairs: AutoRepairResource[];
}
/**
 * Represents a single auto repair resource returned from the API.
 */
export interface AutoRepairResource extends BaseResource {
  id: number;
  ruc: string;
  contactEmail: string;
  name: string;
  locationId: number;
  rating: number;
  totalTechnicians: number;
  availableTechnicians: number;
}
