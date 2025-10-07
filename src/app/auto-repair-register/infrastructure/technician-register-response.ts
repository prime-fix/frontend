import { BaseResponse, BaseResource } from '@shared/infrastructure/http/base-response';

/**
 * Represents the API response structure for a list of Technicians.
 */
export interface TechnicianRegisterResponse extends BaseResponse {
  /**
   * The list of technicians returned by the API.
   */
  technicians: TechnicianRegisterResource[];
}

/**
 * Represents a single Technician resource.
 */
export interface TechnicianRegisterResource extends BaseResource {
  id_technician: string;
  name: string;
  age: number;
  id_user_account: string;
  id_auto_repair: string;
}
