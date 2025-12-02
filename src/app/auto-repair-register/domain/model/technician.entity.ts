import { BaseEntity } from '@shared/infrastructure/http/base-entity';

/**
 * Represents a Technician entity.
 */
export class Technician implements BaseEntity {

  /**
   * The unique identifier for the technician.
   * @private
   */
  private _id: number;

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
  private _auto_repair_id: number;

  /**
   * Creates a new Technician instance.
   * @param technician - An object containing technician properties.
   */
  constructor(technician: {
    id: number;
    name: string;
    last_name: string;
    auto_repair_id: number;
  }) {
    this._id = technician.id;
    this._name = technician.name;
    this._last_name = technician.last_name;
    this._auto_repair_id = technician.auto_repair_id;
  }

  /* --- Getters & Setters --- */
  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
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

  get auto_repair_id(): number {
    return this._auto_repair_id;
  }
  set auto_repair_id(value: number) {
    this._auto_repair_id = value;
  }
}

