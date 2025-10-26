import { Injectable } from '@angular/core';
import {BaseApi} from '@shared/infrastructure/http/base-api';
import {ServiceApiEndpoint} from './service-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Service} from '../domain/model/service.entity';
import {AutoRepairApiEndpoint} from './auto-repair-api-endpoint';
import {VehicleApiEndpoint} from './vehicle-api-endpoint';
import {Vehicle} from '../domain/model/vehicle.entity';
import {VisitApiEndpoint} from './visit-api-endpoint';
import {Visit} from '../domain/model/visit.entity';
import {AutoRepair} from '@collections/domain/model/auto-repair.entity';

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
   * The VehicleApiEndpoint instance for managing vehicles.
   * @private
   */
  private readonly vehicleEndpoint:     VehicleApiEndpoint;
  /**
   * The VisitApiEndpoint instance for managing visits.
   * @private
   */
  private readonly visitEndpoint:     VisitApiEndpoint;
  /**
   * The AutoRepairApiEndpoint instance for managing auto repairs.
   * @private
   */
  private readonly autoRepairsEndpoint:     AutoRepairApiEndpoint;

  /**
   * Constructs a new instance of the DataCollectionApi.
   * @param http - The HttpClient used for making HTTP requests.
   */
  constructor(http: HttpClient) {
    super();
    this.vehicleEndpoint = new VehicleApiEndpoint(http);
    this.mainServiceEndpoint = new ServiceApiEndpoint(http);
    this.visitEndpoint = new VisitApiEndpoint(http);
    this.autoRepairsEndpoint = new AutoRepairApiEndpoint(http);
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
   * Gets all Auto Repairs.
   * @returns An Observable of an array of Auto Repairs.
   */
  getAutoRepairs(): Observable<AutoRepair[]> {
    return this.autoRepairsEndpoint.getAll();
  }

  /**
   * Gets an Auto Repair by its ID.
   * @param id - The ID of the Auto Repair.
   * @returns An Observable of the Auto Repair.
   */
  getAutoRepairById(id: number): Observable<AutoRepair> {
    return this.autoRepairsEndpoint.getById(id);
  }

  /**
   * Creates a new Auto Repair.
   * @param repair - The Auto Repair to create.
   * @returns An Observable of the created Auto Repair.
   */
  createAutoRepair(repair: AutoRepair): Observable<AutoRepair> {
    return this.autoRepairsEndpoint.create(repair);
  }

  /**
   * Updates an existing Auto Repair.
   * @param repair - The Auto Repair to update.
   * @returns An Observable of the updated Auto Repair.
   */
  updateAutoRepair(repair: AutoRepair): Observable<AutoRepair> {
    return this.autoRepairsEndpoint.update(repair, repair.id);
  }

  /**
   * Deletes an Auto Repair by its ID.
   * @param id - The ID of the Auto Repair to delete.
   * @returns An Observable of void.
   */
  deleteAutoRepair(id: number | string): Observable<void> {
    return this.autoRepairsEndpoint.delete(id);
  }

  /**
   * Gets all Vehicles.
   * @returns An Observable of an array of Vehicles.
   */
  getVehicles(): Observable<Vehicle[]> {
    return this.vehicleEndpoint.getAll();
  }

  /**
   * Gets a Vehicle by its ID.
   * @param id - The ID of the Vehicle.
   * @returns An Observable of the Vehicle.
   */
  getVehicleById(id: number): Observable<Vehicle> {
    return this.vehicleEndpoint.getById(id);
  }

  /**
   * Creates a new Vehicle.
   * @param vehicle - The Vehicle to create.
   * @returns An Observable of the created Vehicle.
   */
  createVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.vehicleEndpoint.create(vehicle);
  }

  /**
   * Updates an existing Vehicle.
   * @param vehicle - The Vehicle to update.
   * @returns An Observable of the updated Vehicle.
   */
  updateVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.vehicleEndpoint.update(vehicle, vehicle.id);
  }

  /**
   * Deletes a Vehicle by its ID.
   * @param id - The ID of the Vehicle to delete.
   * @returns An Observable of void.
   */
  deleteVehicle(id: number | string): Observable<void> {
    return this.vehicleEndpoint.delete(id);
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
  getVisitById(id: number): Observable<Visit> {
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
  deleteVisit(id: number | string): Observable<void> {
    return this.visitEndpoint.delete(id);
  }
}





