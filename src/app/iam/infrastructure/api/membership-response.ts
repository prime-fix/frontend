import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Response structure for memberships API.
 */
export interface MembershipResponse extends BaseResponse {
  /**
   * Array of membership resources
   */
  memberships: MembershipResource[];
}

/**
 * Resource structure for memberships API.
 */
export interface MembershipResource extends BaseResource {
  /**
   * Unique identifier for the membership
   */
  id: number;
  /**
   * Description of the membership
   */
  description: string;
  /**
   * Start date of the membership
   */
  started: string;
  /**
   * End date of the membership
   */
  over: string;
}
