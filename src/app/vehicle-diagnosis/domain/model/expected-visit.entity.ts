import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents an expected visit entity in the AutoRepair catalog domain.
 */
export class ExpectedVisit implements BaseEntity {
  /**
   * The unique identifier of the expected visit.
   */
  _id: number;
  /**
   * The state of the visit.
   */
  _state_visit: string;
  /**
   * The identifier of the visit.
   */
  _visit_id: number;
  /**
   * Indicates whether the visit is scheduled.
   */
  _is_scheduled: boolean;
  /**
   * The vehicle ID associated with the expected visit.
   */
  _vehicle_id: number;


  constructor(expectedVisit: { id: number; state_visit: string; visit_id: number; is_scheduled: boolean; vehicle_id: number }) {
    this._id = expectedVisit.id;
    this._state_visit = expectedVisit.state_visit;
    this._visit_id = expectedVisit.visit_id;
    this._is_scheduled = expectedVisit.is_scheduled;
    this._vehicle_id = expectedVisit.vehicle_id;
  }

  /** Getters and Setters */
  get id(): number { return this._id };
  set id(value: number) { this._id = value; }
  get state_visit(): string { return this._state_visit }
  set state_visit(value: string) { this._state_visit = value; }
  get visit_id(): number { return this._visit_id }
  set visit_id(value: number) { this._visit_id = value; }
  get is_scheduled(): boolean { return this._is_scheduled }
  set is_scheduled(value: boolean) { this._is_scheduled = value; }
  get vehicle_id(): number { return this._vehicle_id }
  set vehicle_id(value: number) { this._vehicle_id = value; }
}
