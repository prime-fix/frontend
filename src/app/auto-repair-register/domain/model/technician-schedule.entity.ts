import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a Technician Schedule entity.
 */
export class TechnicianSchedule implements BaseEntity {
  /**
   * The unique identifier for the technician schedule.
   * @private
   */
  private _id_schedule: string;
  /**
   * The unique identifier for the technician.
   * @private
   */
  private _id_technician: string;
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
   * Creates an instance of Technician Schedule.
   * @param {Object} technicianSchedule
   * @param {string} technicianSchedule.id_schedule - The unique identifier for the technician schedule.
   * @param {string} technicianSchedule.id_technician - The unique identifier for the technician.
   * @param {string} technicianSchedule.day_of_week - The day of the week for the schedule.
   * @param {string} technicianSchedule.start_time - The start time of the schedule.
   * @param {string} technicianSchedule.end_time - The end time of the schedule.
   * @param {boolean} technicianSchedule.is_active - Indicates whether the schedule is active.
   */
  constructor(technicianSchedule: {id_schedule: string; id_technician: string; day_of_week: string; start_time: string; end_time: string; is_active: boolean;}) {
        this._id_schedule = technicianSchedule.id_schedule;
        this._id_technician = technicianSchedule.id_technician;
        this._day_of_week = technicianSchedule.day_of_week;
        this._start_time = technicianSchedule.start_time;
        this._end_time = technicianSchedule.end_time;
        this._is_active = technicianSchedule.is_active;
    }

  /**
   * Getters and Setters
   */
  get id(): string {return this._id_schedule;}
  set id(value: string) {this._id_schedule = value;}
  get id_technician(): string {return this._id_technician;}
  set id_technician(value: string) {this._id_technician = value;}
  get day_of_week(): string {return this._day_of_week;}
  set day_of_week(value: string) {this._day_of_week = value;}
  get start_time(): string {return this._start_time;}
  set start_time(value: string) {this._start_time = value;}
  get end_time(): string {return this._end_time;}
  set end_time(value: string) {this._end_time = value;}
  get is_active(): boolean {return this._is_active;}
  set is_active(value: boolean) {this._is_active = value;}
}
