import {UserAccountResource} from '@iam/infrastructure/api/user-account-response';
import {UserResource} from '@iam/infrastructure/api/user-response';

export interface AuthToken {
  accessToken: string;
  expiresAt?: string;
  refreshToken?: string; // por si luego habilitas refresh
}

export interface AuthResponse {
  user_account: UserAccountResource;
  user: UserResource;
  token?: AuthToken;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  // users
  name: string;
  last_name: string;
  dni: string;
  id_location: string;
  // user_accounts
  email: string;
  password: string;
  id_role?: string;
  id_membership?: string;
}
