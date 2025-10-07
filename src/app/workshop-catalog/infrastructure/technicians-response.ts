import { BaseResponse, BaseResource } from '../../shared/infrastructure/http/base-response';
export interface TechniciansResponse extends BaseResponse {
  /**
   * Array of technician resources included in the response.
   */
  technicians: TechnicianResource[];
}
/**
 * Represents a single technician resource returned from the API.
 */
export interface TechnicianResource extends BaseResource {
  id: number;
  name: string;
  age: number;
  autoRepairId: number;
  available: boolean;
}
