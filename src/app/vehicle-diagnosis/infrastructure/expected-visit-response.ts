import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Represents the response structure for expected visits in the AutoRepair catalog domain.
 */
export interface ExpectedVisitResponse extends BaseResponse {
  /**
   * Array of expected visit resources.
   */
  expectedVisits: ExpectedVisitResource[];
}

/**
 * Represents an expected visit resource in the AutoRepair catalog domain.
 */
export interface ExpectedVisitResource extends BaseResource {
  /**
   * The unique identifier of the expected visit.
   */
  id_expected: string;
  /**
   * The state of the visit.
   */
  state_visit: string;
  /**
   * The identifier of the visit.
   */
  id_visit: string;
  /**
   * Indicates whether the visit is scheduled.
   */
  is_scheduled: boolean;
}
