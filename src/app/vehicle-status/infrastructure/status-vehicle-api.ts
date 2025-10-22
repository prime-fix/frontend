import { Injectable } from '@angular/core';
import {BaseApi} from '@shared/infrastructure/http/base-api';
import {StatusVehicle} from '../domain/model/status-vehicle.entity';
import {HttpClient} from '@angular/common/http';
import {StatusVehicleApiEndpoint} from './status-vehicle-api-endpoint';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusVehicleApi extends BaseApi {
  private readonly statusEndpoint:     StatusVehicleApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.statusEndpoint =    new StatusVehicleApiEndpoint(http);
  }

  /**
   * Retrieves all StatusVehicle from the API.
   * @returns An Observable for an array of StatusVehicle objects.
   */
  getStatusVehicles(): Observable<StatusVehicle[]> {
    return this.statusEndpoint.getAll();
  }

  /**
   * Retrieves a single StatusVehicle by ID.
   * @param id - The ID of the StatusVehicle.
   * @returns An Observable of the StatusVehicle object.
   */
  getStatusVehicle(id: number): Observable<StatusVehicle> {
    return this.statusEndpoint.getById(id);
  }

  /**
   * Creates a new StatusVehicle.
   * @returns An Observable of the created StatusVehicle object.
   * @param status
   */
  createStatusVehicle(status: StatusVehicle): Observable<StatusVehicle> {
    return this.statusEndpoint.create(status);
  }

  /**
   * Updates an existing StatusVehicle.
   * @returns An Observable of the updated StatusVehicle object.
   * @param status
   */
  updateStatusVehicle(status: StatusVehicle): Observable<StatusVehicle> {
    return this.statusEndpoint.update(status, status.id);
  }
    /**
   * Deletes a status by ID.
   * @param id - The ID of the status to delete.
   * @returns An Observable of void.
   */
  deleteStatusVehicle(id: number): Observable<void> {
    return this.statusEndpoint.delete(id);
  }
}
