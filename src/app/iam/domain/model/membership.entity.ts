import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a membership for a user in the system.
 */
export class Membership implements BaseEntity {
  /**
   * Unique identifier for the membership
   */
  _id_membership: string;
  /**
   * Description of the membership
   */
  _description: string;
  /**
   * Start date of the membership
   */
  _started: string;
  /**
   * End date of the membership
   */
  _over: string;

  /**
   * Creates a new Membership instance.
   * @param {Object} membership - An object containing membership details.
   * @param {string} membership.id_membership - Unique identifier for the membership.
   * @param {string} membership.description - Description of the membership.
   * @param {string} membership.started - Start date of the membership.
   * @param {string} membership.over - End date of the membership.
   */
  constructor(membership: { id_membership: string; description: string; started: string; over: string; }) {
    this._id_membership = membership.id_membership;
    this._description = membership.description;
    this._started = membership.started;
    this._over = membership.over;
  }

  /** Getters and Setters */
  get id (): string { return this._id_membership; }
  set id (value: string) { this._id_membership = value; }
  get description (): string { return this._description; }
  set description (value: string) { this._description = value; }
  get started (): string { return this._started; }
  set started (value: string) { this._started = value; }
  get over (): string { return this._over; }
  set over (value: string) { this._over = value; }
}
