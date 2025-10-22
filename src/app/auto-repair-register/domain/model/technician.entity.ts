import { BaseEntity } from '@shared/infrastructure/http/base-entity';

/**
 * Represents a Technician entity.
 */
export class Technician implements BaseEntity {

  /**
   * The unique identifier for the technician.
   * @private
   */
  private _id_technician: string;

  /**
   * The first name of the technician.
   * @private
   */
  private _name: string;

  /**
   * The last name of the technician.
   * @private
   */
  private _last_name: string;

  /**
   * The identifier of the auto repair shop the technician is associated with.
   * @private
   */
  private _id_auto_repair: string;

  /**
   * Creates an instance of Technician.
   * @param {Object} technician - An object containing the properties of the technician.
   * @property {string} technician.id_technician - The unique identifier for the technician.
   * @property {string} technician.name - The first name of the technician.
   * @property {string} technician.last_name - The last name of the technician.
   * @property {string} technician.id_auto_repair - The auto repair shop ID.
   */
  constructor(technician: {
    id_technician: string;
    name: string;
    last_name: string;
    id_auto_repair: string;
  }) {
    this._id_technician = technician.id_technician;
    this._name = technician.name;
    this._last_name = technician.last_name;
    this._id_auto_repair = technician.id_auto_repair;
  }

  /* --- Getters & Setters --- */
  get id(): string {
    return this._id_technician;
  }
  set id(value: string) {
    this._id_technician = value;
  }

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  get last_name(): string {
    return this._last_name;
  }

  set last_name(value: string) {
    this._last_name = value;
  }

  get id_auto_repair(): string {
    return this._id_auto_repair;
  }
  set id_auto_repair(value: string) {
    this._id_auto_repair = value;
  }
}

