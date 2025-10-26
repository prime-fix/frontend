import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a visit method associated with a user account.
 */
export class Visit implements BaseEntity{
  _id_visit: string;
  _failure: string;
  _time_visit: string;
  _id_auto_repair: string;
  _id_service: string;
  _status: string;
  _id_vehicle: string;

  /**
   * Creates a new Visit instance.
   * @param visit - An object containing visit details.
   */
  constructor(visit: {
    id_visit: string;
    failure: string;
    time_visit: string;
    id_auto_repair: string;
    id_service: string;
    status: string;
    id_vehicle: string;
  }) {
      this._id_visit = visit.id_visit;
      this._failure = visit.failure;
      this._time_visit = visit.time_visit;
      this._id_auto_repair = visit.id_auto_repair;
      this._id_service = visit.id_service;
      this._status = visit.status;
      this._id_vehicle = visit.id_vehicle;
  }

  /** Getters and Setters */
  get id (): string { return this._id_visit; }
  set id (value: string) { this._id_visit = value; }
  get failure (): string { return this._failure; }
  set failure (value: string) { this._failure = value; }
  get time_visit (): string { return this._time_visit; }
  set time_visit (value: string) { this._time_visit = value; }
  get id_auto_repair (): string { return this._id_auto_repair; }
  set id_auto_repair (value: string) { this._id_auto_repair = value; }
  get id_service (): string { return this._id_service; }
  set id_service (value: string) { this._id_service = value; }
  get status (): string { return this._status; }
  set status (value: string) { this._status = value; }
  get id_vehicle (): string { return this._id_vehicle; }
  set id_vehicle (value: string) { this._id_vehicle = value; }
}
