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

}
