import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a user account in the system.
 */
export class UserAccount implements BaseEntity {
  /**
   * Unique identifier for the user account
   */
  _id_user_account: string;
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
  _id_user: string;
  /**
   * Identifier for the role
   */
  _id_role: string;
  /**
   * Identifier for the membership
   */
  _id_membership: string;
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
   * @param {Object} user_account - An object containing user account details.
   * @param {string} user_account.id_user_account - Unique identifier for the user account.
   * @param {string} user_account.username - Username of the account.
   * @param {string} user_account.email - Email associated with the account.
   * @param {string} user_account.id_user - Identifier for the user.
   * @param {string} user_account.id_role - Identifier for the role.
   * @param {string} user_account.id_membership - Identifier for the membership.
   * @param {string} user_account.password - Password for the account.
   * @param {boolean} user_account.is_new - Indicates if the user is new.
   */
  constructor(user_account: { id_user_account: string; username: string; email: string;
    id_user: string; id_role: string; id_membership: string; password: string;  is_new: boolean; }) {
    this._id_user_account = user_account.id_user_account;
    this._username = user_account.username;
    this._email = user_account.email;
    this._id_user = user_account.id_user;
    this._id_role = user_account.id_role;
    this._id_membership = user_account.id_membership;
    this._password = user_account.password;
    this._is_new = user_account.is_new;
  }

  /** Getters and Setters */
  get id(): string { return this._id_user_account;}
  set id(value: string) { this._id_user_account = value;}
  get username(): string { return this._username; }
  set username(value: string) { this._username = value; }
  get email(): string { return this._email; }
  set email(value: string) { this._email = value; }
  get id_user(): string { return this._id_user; }
  set id_user(value: string) { this._id_user = value; }
  get id_role(): string { return this._id_role; }
  set id_role(value: string) { this._id_role = value; }
  get id_membership(): string { return this._id_membership; }
  set id_membership(value: string) { this._id_membership = value; }
  get password(): string { return this._password; }
  set password(value: string) { this._password = value; }
  get is_new(): boolean { return this._is_new; }
  set is_new(value: boolean) { this._is_new = value; }
}
