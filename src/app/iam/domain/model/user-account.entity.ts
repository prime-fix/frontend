import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a user account in the system.
 */
export class UserAccount implements BaseEntity {
  /**
   * Unique identifier for the user account
   */
  _id: number;
  /**
   * Username of the account
   */
  _username: string;
  /**
   * Email associated with the account
   */
  _email: string;
  /**
   * Identifier for the user
   */
  _user_id: number;
  /**
   * Identifier for the role
   */
  _role_id: number;
  /**
   * Identifier for the membership
   */
  _membership_id: number;
  /**
   * Password for the account
   */
  _password: string;
  /**
   * Indicates if the user is new
   */
  _is_new: boolean;

  /**
   * Creates a new UserAccount instance.
   * @param user_account - An object containing user account details.
   */
  constructor(user_account: { id: number; username: string; email: string;
    user_id: number; role_id: number; membership_id: number; password: string;  is_new: boolean; }) {
    this._id = user_account.id;
    this._username = user_account.username;
    this._email = user_account.email;
    this._user_id = user_account.user_id;
    this._role_id = user_account.role_id;
    this._membership_id = user_account.membership_id;
    this._password = user_account.password;
    this._is_new = user_account.is_new;
  }

  /** Getters and Setters */
  get id(): number { return this._id;}
  set id(value: number) { this._id = value;}
  get username(): string { return this._username; }
  set username(value: string) { this._username = value; }
  get email(): string { return this._email; }
  set email(value: string) { this._email = value; }
  get user_id(): number { return this._user_id; }
  set user_id(value: number) { this._user_id = value; }
  get role_id(): number { return this._role_id; }
  set role_id(value: number) { this._role_id = value; }
  get membership_id(): number { return this._membership_id; }
  set membership_id(value: number) { this._membership_id = value; }
  get password(): string { return this._password; }
  set password(value: string) { this._password = value; }
  get is_new(): boolean { return this._is_new; }
  set is_new(value: boolean) { this._is_new = value; }
}
