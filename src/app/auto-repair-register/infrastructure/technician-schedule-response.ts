import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Represents the response structure for Technician Schedule data.
 */
export interface TechnicianScheduleResponse extends BaseResponse {
  /**
   * An array of Technician Schedule resources.
   */
  technicianSchedules: TechnicianScheduleResource[];
}

/**
 * Represents a Technician Schedule resource.
 */
export interface TechnicianScheduleResource extends BaseResource {
  /**
   * The unique identifier for the technician schedule.
   */
  id_schedule: string;
  /**
   * The unique identifier for the technician.
   */
  id_technician: string;
  /**
   * The day of the week for the schedule.
   */
  day_of_week: string;
  /**
   * The start time of the schedule.
   */
  start_time: string;
  /**
   * The end time of the schedule.
   */
  end_time: string;
  /**
   * Indicates whether the schedule is active.
   */
  is_active: boolean;
}
