import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a user in the system.
 */
export class User implements BaseEntity{
  /**
   * Unique identifier for the user
   */
  _id_user: string;
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
  _id_location: string;


  /**
   * Creates a new User instance.
   * @param {Object} user - An object containing user details.
   * @param {string} user.id_user - Unique identifier for the user.
   * @param {string} user.name - User's first name.
   * @param {string} user.last_name - User's last name.
   * @param {string} user.dni - User's DNI (National Identity Card).
   * @param {string} user.phone_number - User's phone number.
   * @param {string} user.id_location - Identifier for the user's location.
   */
  constructor(user: { id_user: string; name: string; last_name: string; dni: string; phone_number: string; id_location: string; }) {
    this._id_user = user.id_user;
    this._name = user.name;
    this._last_name = user.last_name;
    this._dni = user.dni;
    this._phone_number = user.phone_number;
    this._id_location = user.id_location;
  }

  /** Getters and Setters */
  get id (): string { return this._id_user; }
  set id (value: string) { this._id_user = value; }
  get name (): string { return this._name; }
  set name (value: string) { this._name = value; }
  get last_name (): string { return this._last_name; }
  set last_name (value: string) { this._last_name = value; }
  get dni (): string { return this._dni; }
  set dni (value: string) { this._dni = value; }
  get phone_number (): string { return this._phone_number; }
  set phone_number (value: string) { this._phone_number = value; }
  get id_location (): string { return this._id_location; }
  set id_location (value: string) { this._id_location = value; }
}
