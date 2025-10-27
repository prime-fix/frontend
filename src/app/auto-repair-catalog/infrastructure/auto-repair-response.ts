import { BaseResponse, BaseResource } from '@shared/infrastructure/http/base-response';

/**
 * Represents the response structure for AutoRepair API calls.
 */
export interface AutoRepairResponse extends BaseResponse {
  /**
   * List of Auto Repair resources.
   */
  autoRepairs: AutoRepairResource[];
}

/**
 * Represents an Auto Repair resource.
 */
export interface AutoRepairResource extends BaseResource {
  /**
   * The unique identifier for the auto repair.
   */
  id_auto_repair: string;
  /**
   * The RUC (Taxpayer Identification Number) of the auto repair.
   */
  ruc: string;
  /**
   * The contact email of the auto repair.
   */
  contact_email: string;
  /**
   * The number of technicians associated with the auto repair.
   */
  technicians_count: number;
  /**
   * The user account ID associated with the auto repair.
   */
  id_user_account: string;
}
