import { Injectable } from '@angular/core';
import {BaseApi} from '@shared/infrastructure/http/base-api';
import {ServiceApiEndpoint} from './service-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Service} from '../domain/model/service.entity';
import {AutoRepairApiEndpoint} from './auto-repair-api-endpoint';
import {Repair} from '../domain/model/auto-repair.entity';
import {VehicleApiEndpoint} from './vehicle-api-endpoint';
import {Vehicle} from '../domain/model/vehicle.entity';
import {VisitApiEndpoint} from './visit-api-endpoint';
import {Visit} from '../domain/model/visit.entity';

@Injectable({
  providedIn: 'root'
})
export class DataCollectionApi extends BaseApi {
  private readonly mainServiceEndpoint:     ServiceApiEndpoint;
  private readonly vehicleEndpoint:     VehicleApiEndpoint;
  private readonly visitEndpoint:     VisitApiEndpoint;
  private readonly repairEndpoint:     AutoRepairApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.vehicleEndpoint = new VehicleApiEndpoint(http);
    this.mainServiceEndpoint = new ServiceApiEndpoint(http);
    this.visitEndpoint = new VisitApiEndpoint(http);
    this.repairEndpoint = new AutoRepairApiEndpoint(http);
  }

  getServices(): Observable<Service[]> {
    return this.mainServiceEndpoint.getAll();
  }

  getService(id: number |string): Observable<Service> {
    return this.mainServiceEndpoint.getById(id);
  }

  getRepairs(): Observable<Repair[]> {
    return this.repairEndpoint.getAll();
  }

  getRepair(id: number): Observable<Repair> {
    return this.repairEndpoint.getById(id);
  }

  getVehicles(): Observable<Vehicle[]> {
    return this.vehicleEndpoint.getAll();
  }

  getVehicle(id: number): Observable<Vehicle> {
    return this.vehicleEndpoint.getById(id);
  }

  getVisits(): Observable<Visit[]> {
    return this.visitEndpoint.getAll();
  }

  getVisit(id: number): Observable<Visit> {
    return this.visitEndpoint.getById(id);
  }

  createVisit(visit: Visit): Observable<Visit> {
    return this.visitEndpoint.create(visit);
  }

  updateVisit(visit: Visit): Observable<Visit> {
    return this.visitEndpoint.update(visit, visit.id);
  }

  deleteVisit(id: number | string): Observable<void> {
    return this.visitEndpoint.delete(id);
  }
}





