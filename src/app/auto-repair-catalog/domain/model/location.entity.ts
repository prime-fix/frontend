import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a Location entity.
 */
export class Location implements BaseEntity {
  _id: number;
  _address: string;
  _district: string;
  _department: string;

  /**
   * Constructor
   * @param location - Location data
   */
  constructor(location: { id: number; address: string; district: string; department: string }) {
    this._id = location.id;
    this._address = location.address;
    this._district = location.district;
    this._department = location.department;
  }

  /** Getters and Setters */
  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }
  get address(): string { return this._address; }
  set address(value: string) { this._address = value; }
  get district(): string { return this._district; }
  set district(value: string) { this._district = value; }
  get department(): string { return this._department; }
  set department(value: string) { this._department = value; }

}
