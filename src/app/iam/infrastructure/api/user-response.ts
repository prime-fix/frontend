import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Interface representing the structure of a user response from the API.
 */
export interface UserResponse extends BaseResponse {
  users: UserResource[];
}

/**
 * Interface representing the structure of a user resource.
 */
export interface UserResource extends BaseResource {
  id_user: string;
  name: string;
  last_name: string;
  dni: string;
  phone_number: string;
  id_location: string;
}
