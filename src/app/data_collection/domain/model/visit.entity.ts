import {BaseEntity} from '@shared/infrastructure/http/base-entity';

export class Visit implements BaseEntity{
 _id_visit: number | string;
 _failure: string;
 _id_vehicle: number|string;
 _time_visit: string | null;
 _id_auto_repair: number|string |null;
 _id_service: number | string;
 _status: string;

  constructor( visit:{ id_visit:number | string, failure:string, id_vehicle:number|string, time_visit:string|null, id_auto_repair:number | string | null
  , id_service:number|string, status:string}) {
    this._id_visit=visit.id_visit;
    this._failure=visit.failure;
    this._id_vehicle=visit.id_vehicle;
    this._time_visit=visit.time_visit;
    this._id_auto_repair=visit.id_auto_repair;
    this._id_service = visit.id_service;
    this._status = visit.status;
  }

  get id(): number | string {return this._id_visit;}
  get failure(): string {return this._failure;}
  get id_vehicle():  number|string{return this._id_vehicle;}
  get time_visit(): string|null {return this._time_visit;}
  get id_auto_repair(): number |string |null{return this._id_auto_repair;}
  get id_service(): number|string {return this._id_service;}
  get status(): string {return this._status;}

  set id(value: number| string) {this._id_visit = value;}
  set failure(value: string) {this._failure = value;}
  set id_vehicle(value: number) {this._id_vehicle = value;}
  set time_visit(value: string) {this._time_visit = value;}
  set id_auto_repair(value: number|string) {this._id_auto_repair = value;}
  set id_service(value: number) {this._id_service = value;}
  set status(value: string) {this._status = value;}

}
