import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a role for a user in the system.
 */
export class Role implements BaseEntity {
  /**
   * Unique identifier for the role
   */
  _id_role: string;
  /**
   * Name of the role
   */
  _name: string;
  /**
   * Description of the role
   */
  _description: string;

  /**
   * Creates a new Role instance.
   * @param {Object} role - An object containing role details.
   * @param {string} role.id_role - Unique identifier for the role.
   * @param {string} role.name - Name of the role.
   * @param {string} role.description - Description of the role.
   */
  constructor(role: { id_role: string; name: string; description: string; }) {
    this._id_role = role.id_role;
    this._name = role.name;
    this._description = role.description;
  }

  /** Getters and Setters */
  get id (): string { return this._id_role; }
  set id (value: string) { this._id_role = value; }
  get name (): string { return this._name; }
  set name (value: string) { this._name = value; }
  get description (): string { return this._description; }
  set description (value: string) { this._description = value; }
}
