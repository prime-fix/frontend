import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

export interface UserResponse extends BaseResponse {
  users: UserResource[];
}

export interface UserResource extends BaseResource {
  id_user: string;
  name: string;
  last_name: string;
  dni: string;
  id_location: string;
}
