import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents an expected visit entity in the AutoRepair catalog domain.
 */
export class ExpectedVisit implements BaseEntity {
  /**
   * The unique identifier of the expected visit.
   */
  _id_expected: string;
  /**
   * The state of the visit.
   */
  _state_visit: string;
  /**
   * The identifier of the visit.
   */
  _id_visit: string;
  /**
   * Indicates whether the visit is scheduled.
   */
  _is_scheduled: boolean;

  /**
   * Creates an instance of ExpectedVisit.
   * @param {Object} expectedVisit - The expected visit data.
   * @param {string} expectedVisit.id_expected - The unique identifier of the expected visit.
   * @param {string} expectedVisit.state_visit - The state of the visit.
   * @param {string} expectedVisit.id_visit - The identifier of the visit.
   * @param {boolean} expectedVisit.is_scheduled - Indicates whether the visit is scheduled.
   */
  constructor(expectedVisit: { id_expected: string; state_visit: string; id_visit: string; is_scheduled: boolean }) {
    this._id_expected = expectedVisit.id_expected;
    this._state_visit = expectedVisit.state_visit;
    this._id_visit = expectedVisit.id_visit;
    this._is_scheduled = expectedVisit.is_scheduled;
  }

  /** Getters and Setters */
  get id(): string { return this._id_expected };
  set id(value: string) { this._id_expected = value; }
  get state_visit(): string { return this._state_visit }
  set state_visit(value: string) { this._state_visit = value; }
  get id_visit(): string { return this._id_visit }
  set id_visit(value: string) { this._id_visit = value; }
  get is_scheduled(): boolean { return this._is_scheduled }
  set is_scheduled(value: boolean) { this._is_scheduled = value; }
}
