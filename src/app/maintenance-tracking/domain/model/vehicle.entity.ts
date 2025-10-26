import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a Vehicle entity.
 */
export class Vehicle implements BaseEntity{
  /**
   * The unique identifier for the vehicle.
   */
 _id_vehicle: number;
  /**
   * The color of the vehicle.
   */
 _color: string;
  /**
   * The model of the vehicle.
   */
 _model: string;
  /**
   * The user ID associated with the vehicle.
   */
 _id_user: number;
  /**
   * The brand of the vehicle.
   */
 _vehicle_brand: string;
  /**
   * The plate number of the vehicle.
   */
 _vehicle_plate: string;
  /**
   * The type of the vehicle.
   */
 _vehicle_type: string;

  /**
   * Creates an instance of Vehicle.
   * @param {Object} vehicle - An object containing the properties of the vehicle.
   * @property {number} vehicle.id_vehicle - The unique identifier for the vehicle.
   * @property {string} vehicle.color - The color of the vehicle.
   * @property {string} vehicle.model - The model of the vehicle.
   * @property {number} vehicle.id_user - The user ID associated with the vehicle.
   * @property {string} vehicle.vehicle_brand - The brand of the vehicle.
   * @property {string} vehicle.vehicle_plate - The plate number of the vehicle.
   * @property {string} vehicle.vehicle_type - The type of the vehicle.
   */
  constructor( vehicle:{ id_vehicle:number, color:string, model:string, id_user:number, vehicle_brand:string,
  vehicle_plate:string, vehicle_type:string}) {
    this._id_vehicle=vehicle.id_vehicle;
    this._color=vehicle.color;
    this._model=vehicle.model;
    this._id_user=vehicle.id_user;
    this._vehicle_brand=vehicle.vehicle_brand;
    this._vehicle_plate=vehicle.vehicle_plate;
    this._vehicle_type=vehicle.vehicle_type;
  }

  /* --- Getters & Setters --- */
  get id():  number {return this._id_vehicle;}
  get color(): string {return this._color;}
  get model(): string {return this._model;}
  get id_user(): number {return this._id_user;}
  get vehicle_brand(): string {return this._vehicle_brand;}
  get vehicle_plate(): string {return this._vehicle_plate;}
  get vehicle_type(): string {return this._vehicle_type;}
  set id(value: number) {this._id_vehicle = value;}
  set color(value: string) {this._color = value;}
  set model(value: string) {this._model = value;}
  set id_user(value: number) {this._id_user = value;}
  set vehicle_brand(value: string) {this._vehicle_brand = value;}
  set vehicle_plate(value: string) {this._vehicle_plate = value;}
  set vehicle_type(value: string) {this._vehicle_type = value;}
}
