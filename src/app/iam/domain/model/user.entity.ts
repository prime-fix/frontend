import {BaseEntity} from '@shared/infrastructure/http/base-entity';

export class User implements BaseEntity{
  _id_user: string;
  _name: string;
  _last_name: string;
  _dni: string;
  _id_location: string;

  constructor(user: { id_user: string; name: string; last_name: string; dni: string; id_location: string; }) {
    this._id_user = user.id_user;
    this._name = user.name;
    this._last_name = user.last_name;
    this._dni = user.dni;
    this._id_location = user.id_location;
  }

  get id (): string { return this._id_user; }
  set id (value: string) { this._id_user = value; }
  get name (): string { return this._name; }
  set name (value: string) { this._name = value; }
  get last_name (): string { return this._last_name; }
  set last_name (value: string) { this._last_name = value; }
  get dni (): string { return this._dni; }
  set dni (value: string) { this._dni = value; }
  get id_location (): string { return this._id_location; }
  set id_location (value: string) { this._id_location = value; }
}
