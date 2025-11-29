import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Interface representing the structure of a user response from the API.
 */
export interface UserResponse extends BaseResponse {
  /**
   * Array of user resources.
   */
  users: UserResource[];
}

/**
 * Interface representing the structure of a user resource.
 */
export interface UserResource extends BaseResource {
  /**
   * Unique identifier for the user.
   */
  id_user: string;
  /**
   * User's first name.
   */
  name: string;
  /**
   * User's last name.
   */
  last_name: string;
  /**
   * User's DNI (National Identity Card).
   */
  dni: string;
  /**
   * User's phone number.
   */
  phone_number: string;
  /**
   * Identifier for the user's location.
   */
  id_location: string;
}
