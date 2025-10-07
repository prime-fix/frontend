import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { BaseApi } from '@shared/infrastructure/http/base-api';
import { AutoRepairRegister } from '../domain/model/auto-repair-register.entity';
import { AutoRepairRegisterApiEndpoint } from './auto-repair-register-api-endpoint';

/**
 * Service that provides API methods for managing AutoRepairRegister entities.
 */
@Injectable({
  providedIn: 'root'
})
export class AutoRepairRegisterApi extends BaseApi {
  private readonly autoRepairRegisterEndpoint: AutoRepairRegisterApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.autoRepairRegisterEndpoint = new AutoRepairRegisterApiEndpoint(http);
  }

  /**
   * Retrieves all auto repair registers from the API.
   */
  getAutoRepairRegisters(): Observable<AutoRepairRegister[]> {
    return this.autoRepairRegisterEndpoint.getAll();
  }

  /**
   * Retrieves a specific auto repair register by ID.
   * @param id The ID of the auto repair register.
   */
  getAutoRepairRegisterById(id: string | number): Observable<AutoRepairRegister> {
    return this.autoRepairRegisterEndpoint.getById(Number(id));
  }

  /**
   * Creates a new auto repair register.
   * @param autoRepair The entity to create.
   */
  createAutoRepairRegister(autoRepair: AutoRepairRegister): Observable<AutoRepairRegister> {
    return this.autoRepairRegisterEndpoint.create(autoRepair);
  }

  /**
   * Updates an existing auto repair register.
   * @param autoRepair The entity to update.
   */
  updateAutoRepairRegister(autoRepair: AutoRepairRegister): Observable<AutoRepairRegister> {
    return this.autoRepairRegisterEndpoint.update(autoRepair, Number(autoRepair.id));
  }

  /**
   * Deletes an auto repair register by ID.
   * @param id The ID of the auto repair register to delete.
   */
  deleteAutoRepairRegister(id: string | number): Observable<void> {
    return this.autoRepairRegisterEndpoint.delete(Number(id));
  }
}
