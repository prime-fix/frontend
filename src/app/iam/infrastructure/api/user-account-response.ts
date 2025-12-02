import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Response for user accounts
 */
export interface UserAccountResponse extends BaseResponse{
  /**
   * Array of user accounts
   */
  user_accounts: UserAccountResource[];
}

/**
 * Resource for user accounts
 */
export interface UserAccountResource extends BaseResource {
  /**
   * Unique identifier for the user account
   */
  id: number;
  /**
   * Username of the account
   */
  username: string;
  /**
   * Email associated with the account
   */
  email: string;
  /**
   * Identifier for the user
   */
  user_id: number;
  /**
   * Identifier for the role
   */
  role_id: number;
  /**
   * Identifier for the membership
   */
  membership_id: number;
  /**
   * Password for the account
   */
  password: string;
  /**
   * Indicates if the user is new
   */
  is_new: boolean;
}
