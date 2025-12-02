import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a role for a user in the system.
 */
export class Role implements BaseEntity {
  /**
   * Unique identifier for the role
   */
  _id: number;
  /**
   * Name of the role
   */
  _name: string;

  /**
   * Creates a new Role instance.
   * @param role - An object containing role details.
   */
  constructor(role: { id: number; name: string; }) {
    this._id = role.id;
    this._name = role.name;
  }

  /** Getters and Setters */
  get id (): number { return this._id; }
  set id (value: number) { this._id = value; }
  get name (): string { return this._name; }
  set name (value: string) { this._name = value; }
}
