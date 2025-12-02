import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '@shared/infrastructure/http/base-api';
import { HttpClient } from '@angular/common/http';
import {TechnicianApiEndpoint} from '@register/infrastructure/technician-api-endpoint';
import {Technician} from '@register/domain/model/technician.entity';
import {TechnicianScheduleApiEndpoint} from '@register/infrastructure/technician-schedule-api-endpoint';
import {TechnicianSchedule} from '@register/domain/model/technician-schedule.entity';

/**
 * API service for managing Technicians and Technician Schedules.
 */
@Injectable({
  providedIn: 'root'
})
export class RegisterApi extends BaseApi {
  /**
   * The TechnicianApiEndpoint instance for managing technician registers.
   * @private
   */
  private readonly technicianRegisterEndpoint: TechnicianApiEndpoint;


  /**
   * The TechnicianScheduleApiEndpoint instance for managing technician schedules.
   * @private
   */
  private readonly technicianSchedulesEndpoint: TechnicianScheduleApiEndpoint;

  /**
   * Constructs a new instance of the RegisterApi.
   * @param http - The HttpClient used for making HTTP requests.
   */
  constructor(http: HttpClient) {
    super();
    this.technicianRegisterEndpoint = new TechnicianApiEndpoint(http);
    this.technicianSchedulesEndpoint = new TechnicianScheduleApiEndpoint(http);
  }

  /**
   * Gets all Technicians.
   * @returns An Observable of an array of Technicians.
   */
  getTechnicians(): Observable<Technician[]> {
    return this.technicianRegisterEndpoint.getAll();
  }

  /**
   * Gets a Technician by its ID.
   * @param id - The ID of the Technician.
   */
  getTechnicianById(id: number): Observable<Technician> {
    return this.technicianRegisterEndpoint.getById(id);
  }

  /**
   * Creates a new Technician.
   * @param technician - The Technician to create.
   * @returns An Observable of the created Technician.
   */
  createTechnician(technician: Technician): Observable<Technician> {
    return this.technicianRegisterEndpoint.create(technician);
  }

  /**
   * Updates an existing Technician.
   * @param technician - The Technician to update.
   * @returns An Observable of the updated Technician.
   */
  updateTechnician(technician: Technician): Observable<Technician> {
    return this.technicianRegisterEndpoint.update(technician, technician.id);
  }

  /**
   * Deletes a Technician by its ID.
   * @param id - The ID of the Technician to delete.
   * @returns An Observable of void.
   */
  deleteTechnician(id: number): Observable<void> {
    return this.technicianRegisterEndpoint.delete(id);
  }

  /**
   * Gets all Technician Schedules.
   * @returns An Observable of an array of Technician Schedules.
   */
  getTechnicianSchedules(): Observable<TechnicianSchedule[]> {
    return this.technicianSchedulesEndpoint.getAll();
  }

  /**
   * Gets a Technician Schedule by its ID.
   * @param id - The ID of the Technician Schedule.
   * @returns An Observable of the Technician Schedule.
   */
  getTechnicianScheduleById(id: number): Observable<TechnicianSchedule> {
    return this.technicianSchedulesEndpoint.getById(id);
  }

  /**
   * Creates a new Technician Schedule.
   * @param technicianSchedule - The Technician Schedule to create.
   * @returns An Observable of the created Technician Schedule.
   */
  createTechnicianSchedule(technicianSchedule: TechnicianSchedule): Observable<TechnicianSchedule> {
    return this.technicianSchedulesEndpoint.create(technicianSchedule);
  }

  /**
   * Updates an existing Technician Schedule.
   * @param technicianSchedule - The Technician Schedule to update.
   * @returns An Observable of the updated Technician Schedule.
   */
  updateTechnicianSchedule(technicianSchedule: TechnicianSchedule): Observable<TechnicianSchedule> {
    return this.technicianSchedulesEndpoint.update(technicianSchedule, technicianSchedule.id);
  }

  /**
   * Deletes a Technician Schedule by its ID.
   * @param id - The ID of the Technician Schedule to delete.
   * @returns An Observable of void.
   */
  deleteTechnicianSchedule(id: number): Observable<void> {
    return this.technicianSchedulesEndpoint.delete(id);
  }
}
