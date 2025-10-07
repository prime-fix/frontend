import { BaseEntity } from '../../../shared/infrastructure/http/base-entity';
export class Technician implements BaseEntity{
  private _id: number;
  private _name: string;
  private _age: number;
  private _autoRepairId: number;
  private _available: boolean;
  constructor(technician: {
    id: number;
    name: string;
    age: number;
    autoRepairId: number;
    available: boolean
  }) {
    this._id = technician.id;
    this._name = technician.name;
    this._age = technician.age;
    this._autoRepairId = technician.autoRepairId;
    this._available = technician.available;
  }
  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }
  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }
  get age(): number { return this._age; }
  set age(value: number) { this._age = value; }
  get autoRepairId(): number { return this._autoRepairId; }
  set autoRepairId(value: number) { this._autoRepairId = value; }

  get available(): boolean { return this._available; }
  set available(value: boolean) { this._available = value; }

}
