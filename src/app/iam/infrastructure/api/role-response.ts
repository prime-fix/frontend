import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Response structure for roles API.
 */
export interface RoleResponse extends BaseResponse{
  /**
   * Array of role resources
   */
  roles: RoleResource[];
}

/**
 * Resource structure for roles API.
 */
export interface RoleResource extends BaseResource {
  /**
   * Unique identifier for the role
   */
  id: number;
  /**
   * Name of the role
   */
  name: string;
}
