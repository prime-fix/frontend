import {BaseEntity} from '@shared/infrastructure/http/base-entity';

export class UserAccount implements BaseEntity {
  _id_user_account: string;
  _email: string;
  _id_user: string;
  _id_role: string;
  _id_membership: string;
  _password: string;

  constructor(user_account: { id_user_account: string; email: string; id_user: string; id_role: string; id_membership: string; password: string; }) {
    this._id_user_account = user_account.id_user_account;
    this._email = user_account.email;
    this._id_user = user_account.id_user;
    this._id_role = user_account.id_role;
    this._id_membership = user_account.id_membership;
    this._password = user_account.password;
  }

  get id(): string { return this._id_user_account;}
  set id(value: string) { this._id_user_account = value;}
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
}
