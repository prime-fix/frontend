import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a Visit entity.
 */
export class Visit implements BaseEntity{
  /**
   * The unique identifier for the visit.
   */
 _id: number;
  /**
   * The failure description of the visit.
   */
 _failure: string;
  /**
   * The unique identifier for the vehicle associated with the visit.
   */
 _vehicle_id: number;
  /**
   * The time of the visit.
   */
 _time_visit: string;
 /**
  * The unique identifier for the auto repair associated with the visit.
  */
 _auto_repair_id: number;
  /**
   * The unique identifier for the service associated with the visit.
   */
 _service_id: number;

  /**
   * Creates an instance of Visit.
   * @param visit - An object containing the properties of the visit.
   */
  constructor( visit:{ id:number, failure:string, vehicle_id:number, time_visit:string, auto_repair_id:number
  , service_id:number}) {
    this._id=visit.id;
    this._failure=visit.failure;
    this._vehicle_id=visit.vehicle_id;
    this._time_visit=visit.time_visit;
    this._auto_repair_id=visit.auto_repair_id;
    this._service_id=visit.service_id;
  }
  /* --- Getters & Setters --- */
  get id(): number {return this._id;}
  set id(value: number) {this._id = value;}
  get failure(): string {return this._failure;}
  set failure(value: string) {this._failure = value;}
  get vehicle_id(): number {return this._vehicle_id;}
  set vehicle_id(value: number) {this._vehicle_id = value;}
  get time_visit(): string {return this._time_visit;}
  set time_visit(value: string) {this._time_visit = value;}
  get auto_repair_id(): number {return this._auto_repair_id;}
  set auto_repair_id(value: number) {this._auto_repair_id = value;}
  get service_id(): number {return this._service_id;}
  set service_id(value: number) {this._service_id = value;}
}
