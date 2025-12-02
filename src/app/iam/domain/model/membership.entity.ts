import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a membership for a user in the system.
 */
export class Membership implements BaseEntity {
  /**
   * Unique identifier for the membership
   */
  _id: number;
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
   * @param membership - An object containing membership details.
   */
  constructor(membership: { id: number; description: string; started: string; over: string; }) {
    this._id = membership.id;
    this._description = membership.description;
    this._started = membership.started;
    this._over = membership.over;
  }

  /** Getters and Setters */
  get id (): number { return this._id; }
  set id (value: number) { this._id = value; }
  get description (): string { return this._description; }
  set description (value: string) { this._description = value; }
  get started (): string { return this._started; }
  set started (value: string) { this._started = value; }
  get over (): string { return this._over; }
  set over (value: string) { this._over = value; }
}
