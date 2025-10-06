import { BaseEntity } from '@shared/infrastructure/http/base-entity';

export class StatusVehicle implements BaseEntity {
  private _id: number;
  private _vehicle: string;
  private _license_plate: string;
  private _owner: string;
  private _status: string;
  private _diagnostic: string;
  private _price: number;

  constructor(status: {
    id: number;
    vehicle: string;
    license_plate: string;
    owner: string;
    status: string;
    diagnostic: string;
    price: number;
  }) {
    this._id = status.id;
    this._vehicle = status.vehicle;
    this._license_plate = status.license_plate;
    this._owner = status.owner;
    this._status = status.status;
    this._diagnostic = status.diagnostic;
    this._price = status.price;
  }

  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  get vehicle(): string {
    return this._vehicle;
  }
  set vehicle(value: string) {
    this._vehicle = value;
  }

  get license_plate(): string {
    return this._license_plate;
  }
  set license_plate(value: string) {
    this._license_plate = value;
  }

  get owner(): string {
    return this._owner;
  }
  set owner(value: string) {
    this._owner = value;
  }

  get status(): string {
    return this._status;
  }
  set status(value: string) {
    this._status = value;
  }

  get diagnostic(): string {
    return this._diagnostic;
  }
  set diagnostic(value: string) {
    this._diagnostic = value;
  }

  get price(): number {
    return this._price;
  }
  set price(value: number) {
    this._price = value;
  }

}
