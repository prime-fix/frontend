import { Injectable } from '@angular/core';
import { BaseApi } from '../../shared/infrastructure/http/base-api';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Location } from '../domain/model/location.entity';
import { AutoRepair } from '../domain/model/auto-repair.entity';
import { Technician } from '../domain/model/technician.entity';

import { LocationsApiEndpoint } from './locations-api-endpoint';
import { AutoRepairsApiEndpoint } from './auto-repairs-api-endpoint';
import { TechniciansApiEndpoint } from './technicians-api-endpoint';

@Injectable({
  providedIn: 'root'
})

export class WorkshopCatalogApi extends BaseApi {
  private readonly locationsEndpoint: LocationsApiEndpoint;
  private readonly autoRepairsEndpoint: AutoRepairsApiEndpoint;
  private readonly techniciansEndpoint: TechniciansApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.locationsEndpoint = new LocationsApiEndpoint(http);
    this.autoRepairsEndpoint = new AutoRepairsApiEndpoint(http);
    this.techniciansEndpoint = new TechniciansApiEndpoint(http);
  }

  /** Retrieves all locations from the API. */
  getLocations(): Observable<Location[]> {
    return this.locationsEndpoint.getAll();
  }

  /** Retrieves a single location by ID. */
  getLocation(id: number): Observable<Location> {
    return this.locationsEndpoint.getById(id);
  }

  /** Retrieves all auto repairs from the API. */
  getAutoRepairs(): Observable<AutoRepair[]> {
    return this.autoRepairsEndpoint.getAll();
  }

  /** Retrieves a single auto repair by ID. */
  getAutoRepair(id: number): Observable<AutoRepair> {
    return this.autoRepairsEndpoint.getById(id);
  }

  /** Creates a new auto repair. */
  createAutoRepair(autoRepair: AutoRepair): Observable<AutoRepair> {
    return this.autoRepairsEndpoint.create(autoRepair);
  }

  /** Updates an existing auto repair. */
  updateAutoRepair(autoRepair: AutoRepair): Observable<AutoRepair> {
    return this.autoRepairsEndpoint.update(autoRepair, autoRepair.id);
  }

  /** Deletes an auto repair by ID. */
  deleteAutoRepair(id: number): Observable<void> {
    return this.autoRepairsEndpoint.delete(id);
  }

  /** Retrieves all technicians from the API. */
  getTechnicians(): Observable<Technician[]> {
    return this.techniciansEndpoint.getAll();
  }

  /** Retrieves a single technician by ID. */
  getTechnician(id: number): Observable<Technician> {
    return this.techniciansEndpoint.getById(id);
  }
}
