import { BaseResponse, BaseResource } from '@shared/infrastructure/http/base-response';

/**
 * Represents the response structure for Technician data.
 */
export interface TechnicianResponse extends BaseResponse {
  /**
   * An array of Technician resources.
   */
  technicians: TechnicianResource[];
}

/**
 * Represents a Technician resource.
 */
export interface TechnicianResource extends BaseResource {
  id: number;
  name: string;
  last_name: string;
  auto_repair_id: number;
}
