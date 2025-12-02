import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a Technician Schedule entity.
 */
export class TechnicianSchedule implements BaseEntity {
  /**
   * The unique identifier for the technician schedule.
   * @private
   */
  private _id: number;
  /**
   * The unique identifier for the technician.
   * @private
   */
  private _technician_id: number;
  /**
   * The day of the week for the schedule.
   * @private
   */
  private _day_of_week: string;
  /**
   * The start time of the schedule.
   * @private
   */
  private _start_time: string;
  /**
   * The end time of the schedule.
   * @private
   */
    private _end_time: string;
  /**
   * Indicates whether the schedule is active.
   * @private
   */
  private _is_active: boolean;

  /**
   * Constructor for TechnicianSchedule.
   * @param technicianSchedule - An object containing technician schedule details.
   */
  constructor(technicianSchedule: {id: number; technician_id: number; day_of_week: string; start_time: string; end_time: string; is_active: boolean;}) {
        this._id = technicianSchedule.id;
        this._technician_id = technicianSchedule.technician_id;
        this._day_of_week = technicianSchedule.day_of_week;
        this._start_time = technicianSchedule.start_time;
        this._end_time = technicianSchedule.end_time;
        this._is_active = technicianSchedule.is_active;
    }

  /**
   * Getters and Setters
   */
  get id(): number {return this._id;}
  set id(value: number) {this._id = value;}
  get technician_id(): number {return this._technician_id;}
  set technician_id(value: number) {this._technician_id = value;}
  get day_of_week(): string {return this._day_of_week;}
  set day_of_week(value: string) {this._day_of_week = value;}
  get start_time(): string {return this._start_time;}
  set start_time(value: string) {this._start_time = value;}
  get end_time(): string {return this._end_time;}
  set end_time(value: string) {this._end_time = value;}
  get is_active(): boolean {return this._is_active;}
  set is_active(value: boolean) {this._is_active = value;}
}
