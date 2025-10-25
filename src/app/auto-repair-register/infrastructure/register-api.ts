import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from '@shared/infrastructure/http/base-api';
import { HttpClient } from '@angular/common/http';
import {AutoRepairApiEndpoint} from '@register/infrastructure/auto-repair-api-endpoint';
import {TechnicianApiEndpoint} from '@register/infrastructure/technician-api-endpoint';
import {AutoRepair} from '@register/domain/model/auto-repair.entity';
import {Technician} from '@register/domain/model/technician.entity';
import {TechnicianScheduleApiEndpoint} from '@register/infrastructure/technician-schedule-api-endpoint';
import {TechnicianSchedule} from '@register/domain/model/technician-schedule.entity';

/**
 * API service for managing Auto Repair and Technician registers.
 */
@Injectable({
  providedIn: 'root'
})
export class RegisterApi extends BaseApi {
  /**
   * The HttpClient instance for making HTTP requests.
   * @private
   */
  private readonly autoRepairEndpoint: AutoRepairApiEndpoint;

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
   * Constructs a new instance of the Auto Repair Register Api.
   * @param http - The HttpClient used for making HTTP requests.
   */
  constructor(http: HttpClient) {
    super();
    this.autoRepairEndpoint = new AutoRepairApiEndpoint(http);
    this.technicianRegisterEndpoint = new TechnicianApiEndpoint(http);
    this.technicianSchedulesEndpoint = new TechnicianScheduleApiEndpoint(http);
  }

  /**
   * Gets all Auto Repairs.
   * @returns An Observable of an array of Auto Repairs.
   */
  getAutoRepairs(): Observable<AutoRepair[]> {
    return this.autoRepairEndpoint.getAll();
  }

  /**
   * Gets an Auto Repair by its ID.
   * @param id - The ID of the Auto Repair.
   * @returns An Observable of the Auto Repair.
   */
  getAutoRepairById(id: string | number): Observable<AutoRepair> {
    return this.autoRepairEndpoint.getById(id);
  }

  /**
   * Creates a new Auto Repair.
   * @param autoRepair - The Auto Repair to create.
   * @returns An Observable of the created Auto Repair.
   */
  createAutoRepair(autoRepair: AutoRepair): Observable<AutoRepair> {
    return this.autoRepairEndpoint.create(autoRepair);
  }

  /**
   * Updates an existing Auto Repair.
   * @param autoRepair - The Auto Repair to update.
   * @returns An Observable of the updated Auto Repair.
   */
  updateAutoRepair(autoRepair: AutoRepair): Observable<AutoRepair> {
    return this.autoRepairEndpoint.update(autoRepair, autoRepair.id);
  }

  /**
   * Deletes an Auto Repair by its ID.
   * @param id - The ID of the Auto Repair to delete.
   * @returns An Observable of void.
   */
  deleteAutoRepair(id: string | number): Observable<void> {
    return this.autoRepairEndpoint.delete(id);
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
  getTechnicianById(id: string | number): Observable<Technician> {
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
  deleteTechnician(id: string | number): Observable<void> {
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
  getTechnicianScheduleById(id: string | number): Observable<TechnicianSchedule> {
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
  deleteTechnicianSchedule(id: string | number): Observable<void> {
    return this.technicianSchedulesEndpoint.delete(id);
  }
}
