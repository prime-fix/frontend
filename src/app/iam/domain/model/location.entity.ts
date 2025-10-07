import {BaseEntity} from '@shared/infrastructure/http/base-entity';

export class Location implements BaseEntity {
  _id_location: string;
  _address: string;
  _district: string;
  _department: string;

  constructor(location: { id_location: string; address: string; district: string; department: string }) {
    this._id_location = location.id_location;
    this._address = location.address;
    this._district = location.district;
    this._department = location.department;
  }

  get id(): string { return this._id_location; }
  set id(value: string) { this._id_location = value; }
  get address(): string { return this._address; }
  set address(value: string) { this._address = value; }
  get district(): string { return this._district; }
  set district(value: string) { this._district = value; }
  get department(): string { return this._department; }
  set department(value: string) { this._department = value; }

}
