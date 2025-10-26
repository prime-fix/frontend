import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a vehicle method associated with a user account.
 */
export class Vehicle implements BaseEntity {
  _id_vehicle: string;
  _model: string;
  _id_user: string;
  _vehicle_brand: string;
  _vehicle_plate: string;
  _vehicle_type: string;
  _color: string;

  /**
   * Creates a new Vehicle instance.
   * @param vehicle - An object containing vehicle details.
   */
  constructor(vehicle: {
    id_vehicle: string;
    model: string;
    id_user: string;
    vehicle_brand: string;
    vehicle_plate: string;
    vehicle_type: string;
    color: string;
  }){
      this._id_vehicle = vehicle.id_vehicle;
      this._model = vehicle.model;
      this._id_user = vehicle.id_user;
      this._vehicle_brand = vehicle.vehicle_brand;
      this._vehicle_plate = vehicle.vehicle_plate;
      this._vehicle_type = vehicle.vehicle_type;
      this._color = vehicle.color;
 }

  /** Getters and Setters */
  get id (): string { return this._id_vehicle; }
  set id (value: string) { this._id_vehicle = value; }
  get model (): string { return this._model; }
  set model (value: string) { this._model = value; }
  get id_user (): string { return this._id_user; }
  set id_user (value: string) { this._id_user = value; }
  get vehicle_brand (): string { return this._vehicle_brand; }
  set vehicle_brand (value: string) { this._vehicle_brand = value; }
  get vehicle_plate (): string { return this._vehicle_plate; }
  set vehicle_plate (value: string) { this._vehicle_plate = value; }
  get vehicle_type (): string { return this._vehicle_type; }
  set vehicle_type (value: string) { this._vehicle_type = value; }
  get color (): string { return this._color; }
  set color (value: string) { this._color = value; }

}
