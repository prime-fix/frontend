import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseApi } from '@shared/infrastructure/http/base-api';
import { AutoRepairRegister } from '../domain/model/auto-repair-register.entity';
import { TechnicianRegister } from '../domain/model/technician-register.entity';

import { HttpClient } from '@angular/common/http';

import { AutoRepairRegisterApiEndpoint } from './auto-repair-register-api-endpoint';
import { TechnicianRegisterApiEndpoint } from './technician-register-api-endpoint';

/**
 * Service that provides API methods for managing AutoRepairRegister
 * and TechnicianRegister entities.
 */
@Injectable({
  providedIn: 'root'
})
export class AutoRepairRegisterApi extends BaseApi {
  private readonly autoRepairRegisterEndpoint: AutoRepairRegisterApiEndpoint;
  private readonly technicianRegisterEndpoint: TechnicianRegisterApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.autoRepairRegisterEndpoint = new AutoRepairRegisterApiEndpoint(http);
    this.technicianRegisterEndpoint = new TechnicianRegisterApiEndpoint(http);
  }

  // ------------------ AutoRepairRegister ------------------

  getAutoRepairRegisters(): Observable<AutoRepairRegister[]> {
    return this.autoRepairRegisterEndpoint.getAll();
  }

  getAutoRepairRegisterById(id: string | number): Observable<AutoRepairRegister> {
    return this.autoRepairRegisterEndpoint.getById(Number(id));
  }

  createAutoRepairRegister(autoRepair: AutoRepairRegister): Observable<AutoRepairRegister> {
    return this.autoRepairRegisterEndpoint.create(autoRepair);
  }

  updateAutoRepairRegister(autoRepair: AutoRepairRegister): Observable<AutoRepairRegister> {
    return this.autoRepairRegisterEndpoint.update(autoRepair, Number(autoRepair.id));
  }

  deleteAutoRepairRegister(id: string | number): Observable<void> {
    return this.autoRepairRegisterEndpoint.delete(Number(id));
  }

  // ------------------ TechnicianRegister ------------------

  getTechnicians(): Observable<TechnicianRegister[]> {
    return this.technicianRegisterEndpoint.getAll();
  }

  getTechnicianById(id: string | number): Observable<TechnicianRegister> {
    return this.technicianRegisterEndpoint.getById(Number(id));
  }

  createTechnician(technician: TechnicianRegister): Observable<TechnicianRegister> {
    return this.technicianRegisterEndpoint.create(technician);
  }

  updateTechnician(technician: TechnicianRegister): Observable<TechnicianRegister> {
    return this.technicianRegisterEndpoint.update(technician, Number(technician.id));
  }

  deleteTechnician(id: string | number): Observable<void> {
    return this.technicianRegisterEndpoint.delete(Number(id));
  }
}
