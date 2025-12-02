import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a user in the system.
 */
export class User implements BaseEntity{
  /**
   * Unique identifier for the user
   */
  _id: number;
  /**
   * User's first name
   */
  _name: string;
  /**
   * User's last name
   */
  _last_name: string;
  /**
   * User's DNI (National Identity Card)
   */
  _dni: string;
  /**
   * User's phone number
   */
  _phone_number: string;
  /**
   * Identifier for the user's location
   */
  _location_id: number;


  /**
   * Creates a new User instance.
   * @param user - An object containing user details.
   */
  constructor(user: { id: number; name: string; last_name: string; dni: string; phone_number: string; location_id: number; }) {
    this._id = user.id;
    this._name = user.name;
    this._last_name = user.last_name;
    this._dni = user.dni;
    this._phone_number = user.phone_number;
    this._location_id = user.location_id;
  }

  /** Getters and Setters */
  get id (): number { return this._id; }
  set id (value: number) { this._id = value; }
  get name (): string { return this._name; }
  set name (value: string) { this._name = value; }
  get last_name (): string { return this._last_name; }
  set last_name (value: string) { this._last_name = value; }
  get dni (): string { return this._dni; }
  set dni (value: string) { this._dni = value; }
  get phone_number (): string { return this._phone_number; }
  set phone_number (value: string) { this._phone_number = value; }
  get location_id (): number { return this._location_id; }
  set location_id (value: number) { this._location_id = value; }
}
