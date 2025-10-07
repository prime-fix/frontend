import { BaseResponse, BaseResource } from '@shared/infrastructure/http/base-response';

/**
 * Represents the API response structure for a list of AutoRepair entities.
 */
export interface AutoRepairRegisterResponse extends BaseResponse {
  /**
   * The list of auto repair shops returned by the API.
   */
  autoRepairs: AutoRepairRegisterResource[];
}

/**
 * Represents a single AutoRepair resource.
 */
export interface AutoRepairRegisterResource extends BaseResource {
  id_auto_repair: string;
  RUC: string;
  contact_email: string;
  technicians_count: number;
  id_location: string;

  /**
   * Optional list of technicians associated with this AutoRepair.
   */
  technicians?: TechnicianResource[];
}

/**
 * Represents a Technician associated with an AutoRepair.
 */
export interface TechnicianResource extends BaseResource {
  id_technisian: string;
  name: string;
  age: number;
  id_user_acount: string;
  id_auto_repair: string;
}
