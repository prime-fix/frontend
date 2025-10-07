import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

export interface UserAccountResponse extends BaseResponse{
  user_accounts: UserAccountResource[];
}

export interface UserAccountResource extends BaseResource {
  id_user_account: string;
  username: string;
  email: string;
  id_user: string;
  id_role: string;
  id_membership: string;
  password: string;
}
