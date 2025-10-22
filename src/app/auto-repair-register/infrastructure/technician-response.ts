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
  id_technician: string;
  name: string;
  last_name: string;
  id_auto_repair: string;
}
