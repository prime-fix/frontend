import { Injectable } from '@angular/core';
import {BaseApi} from '@shared/infrastructure/http/base-api';
import {ServiceApiEndpoint} from './service-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Service} from '../domain/model/service.entity';
import {VisitApiEndpoint} from './visit-api-endpoint';
import {Visit} from '../domain/model/visit.entity';

@Injectable({
  providedIn: 'root'
})
/**
 * API service for managing Data Collection including Services, Vehicles, Visits, and Auto Repairs.
 */
export class DataCollectionApi extends BaseApi {
  /**
   * The ServiceApiEndpoint instance for managing services.
   * @private
   */
  private readonly mainServiceEndpoint:     ServiceApiEndpoint;
  /**
   * The VisitApiEndpoint instance for managing visits.
   * @private
   */
  private readonly visitEndpoint:     VisitApiEndpoint;

  /**
   * Constructs a new instance of the DataCollectionApi.
   * @param http - The HttpClient used for making HTTP requests.
   */
  constructor(http: HttpClient) {
    super();
    this.mainServiceEndpoint = new ServiceApiEndpoint(http);
    this.visitEndpoint = new VisitApiEndpoint(http);
  }

  /**
   * Gets all Services.
   * @returns An Observable of an array of Services.
   */
  getServices(): Observable<Service[]> {
    return this.mainServiceEndpoint.getAll();
  }

  /**
   * Gets a Service by its ID.
   * @param id - The ID of the Service.
   * @returns An Observable of the Service.
   */
  getServiceById(id: number |string): Observable<Service> {
    return this.mainServiceEndpoint.getById(id);
  }

  /**
   * Creates a new Service.
   * @param service - The Service to create.
   * @returns An Observable of the created Service.
   */
  createService(service: Service): Observable<Service> {
    return this.mainServiceEndpoint.create(service);
  }

  /**
   * Updates an existing Service.
   * @param service - The Service to update.
   * @returns An Observable of the updated Service.
   */
  updateService(service: Service): Observable<Service> {
    return this.mainServiceEndpoint.update(service, service.id);
  }

  /**
   * Deletes a Service by its ID.
   * @param id - The ID of the Service to delete.
   * @returns An Observable of void.
   */
  deleteService(id: number | string): Observable<void> {
    return this.mainServiceEndpoint.delete(id);
  }

  /**
   * Gets all Visits.
   * @returns An Observable of an array of Visits.
   */
  getVisits(): Observable<Visit[]> {
    return this.visitEndpoint.getAll();
  }

  /**
   * Gets a Visit by its ID.
   * @param id - The ID of the Visit.
   * @returns An Observable of the Visit.
   */
  getVisitById(id: string): Observable<Visit> {
    return this.visitEndpoint.getById(id);
  }

  /**
   * Creates a new Visit.
   * @param visit - The Visit to create.
   * @returns An Observable of the created Visit.
   */
  createVisit(visit: Visit): Observable<Visit> {
    return this.visitEndpoint.create(visit);
  }

  /**
   * Updates an existing Visit.
   * @param visit - The Visit to update.
   * @returns An Observable of the updated Visit.
   */
  updateVisit(visit: Visit): Observable<Visit> {
    return this.visitEndpoint.update(visit, visit.id);
  }

  /**
   * Deletes a Visit by its ID.
   * @param id - The ID of the Visit to delete.
   * @returns An Observable of void.
   */
  deleteVisit(id: string): Observable<void> {
    return this.visitEndpoint.delete(id);
  }
}





