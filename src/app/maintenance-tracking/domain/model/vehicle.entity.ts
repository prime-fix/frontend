import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a Vehicle entity.
 */
export class Vehicle implements BaseEntity{
  /**
   * The unique identifier for the vehicle.
   */
 _id: number;
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
 _user_id: number;
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
   * The maintenance state of the vehicle.
   */
 _maintenance_status: number;

  /**
   * Creates an instance of Vehicle.
   * @param vehicle - An object containing the properties of the vehicle.
   */
  constructor( vehicle:{ id:number, color:string, model:string, user_id:number, vehicle_brand:string,
  vehicle_plate:string, vehicle_type:string, maintenance_status:number }) {
    this._id=vehicle.id;
    this._color=vehicle.color;
    this._model=vehicle.model;
    this._user_id=vehicle.user_id;
    this._vehicle_brand=vehicle.vehicle_brand;
    this._vehicle_plate=vehicle.vehicle_plate;
    this._vehicle_type=vehicle.vehicle_type;
    this._maintenance_status=vehicle.maintenance_status;
  }

  /* --- Getters & Setters --- */
  get id():  number {return this._id;}
  get color(): string {return this._color;}
  get model(): string {return this._model;}
  get user_id(): number {return this._user_id;}
  get vehicle_brand(): string {return this._vehicle_brand;}
  get vehicle_plate(): string {return this._vehicle_plate;}
  get vehicle_type(): string {return this._vehicle_type;}
  get maintenance_status(): number {return this._maintenance_status;}
  set id(value: number) {this._id = value;}
  set color(value: string) {this._color = value;}
  set model(value: string) {this._model = value;}
  set user_id(value: number) {this._user_id = value;}
  set vehicle_brand(value: string) {this._vehicle_brand = value;}
  set vehicle_plate(value: string) {this._vehicle_plate = value;}
  set vehicle_type(value: string) {this._vehicle_type = value;}
  set maintenance_status(value: number) {this._maintenance_status = value;}
}
