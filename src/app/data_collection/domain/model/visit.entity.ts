import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a Visit entity.
 */
export class Visit implements BaseEntity{
  /**
   * The unique identifier for the visit.
   */
 _id_visit: string;
  /**
   * The failure description of the visit.
   */
 _failure: string;
  /**
   * The unique identifier for the vehicle associated with the visit.
   */
 _id_vehicle: string;
  /**
   * The time of the visit.
   */
 _time_visit: string;
 /**
  * The unique identifier for the auto repair associated with the visit.
  */
 _id_auto_repair: string;
  /**
   * The unique identifier for the service associated with the visit.
   */
 _id_service: string;

  /**
   * Creates an instance of Visit.
   * @param {Object} visit - An object containing the properties of the visit.
   * @property {number|string} visit.id_visit - The unique identifier for the visit.
   * @property {string} visit.failure - The failure description of the visit.
   * @property {number|string} visit.id_vehicle - The unique identifier for the vehicle.
   * @property {string|null} visit.time_visit - The time of the visit.
   * @property {number|string|null} visit.id_auto_repair - The unique identifier for the auto repair.
   * @property {number|string} visit.id_service - The unique identifier for the service.
   */
  constructor( visit:{ id_visit:string, failure:string, id_vehicle:string, time_visit:string, id_auto_repair:string
  , id_service:string}) {
    this._id_visit=visit.id_visit;
    this._failure=visit.failure;
    this._id_vehicle=visit.id_vehicle;
    this._time_visit=visit.time_visit;
    this._id_auto_repair=visit.id_auto_repair;
    this._id_service = visit.id_service;
  }
  /* --- Getters & Setters --- */
  get id(): string {return this._id_visit;}
  get failure(): string {return this._failure;}
  get id_vehicle(): string {return this._id_vehicle;}
  get time_visit(): string {return this._time_visit;}
  get id_auto_repair(): string {return this._id_auto_repair;}
  get id_service(): string {return this._id_service;}

  set id(value: string) {this._id_visit = value;}
  set failure(value: string) {this._failure = value;}
  set id_vehicle(value: string) {this._id_vehicle = value;}
  set time_visit(value: string) {this._time_visit = value;}
  set id_auto_repair(value: string) {this._id_auto_repair = value;}
  set id_service(value: string) {this._id_service = value;}

}
