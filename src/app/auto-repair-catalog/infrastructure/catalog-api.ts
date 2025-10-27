import {Injectable} from '@angular/core';
import {BaseApi} from '@shared/infrastructure/http/base-api';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Location} from '@catalog/domain/model/location.entity';
import {LocationApiEndpoint} from '@catalog/infrastructure/location-api-endpoint';
import {AutoRepairApiEndpoint} from '@catalog/infrastructure/auto-repair-api-endpoint';
import {AutoRepair} from '@catalog/domain/model/auto-repair.entity';

/**
 * Catalog API service that provides methods to interact with the AutoRepair catalog backend.
 * This service includes operations for managing locations.
 */
@Injectable({
  providedIn: 'root',
})
export class CatalogApi extends BaseApi {

  /**
   * API endpoint for location-related operations.
   * @private
   */
  private readonly locationsEndpoint: LocationApiEndpoint;

  /**
   * The AutoRepairApiEndpoint instance for managing auto repairs.
   * @private
   */
  private readonly autoRepairsEndpoint:     AutoRepairApiEndpoint;

  /**
   * Constructor to initialize the Catalog API service with the LocationApiEndpoint.
   * @param http - The HttpClient instance for making HTTP requests.
   */
  constructor(http: HttpClient) {
    super();
    this.locationsEndpoint = new LocationApiEndpoint(http);
    this.autoRepairsEndpoint = new AutoRepairApiEndpoint(http);
  }

  /**
   * Fetches all locations from the backend.
   * @returns An Observable emitting an array of Location entities.
   */
  getLocations(): Observable<Location[]> {
    return this.locationsEndpoint.getAll();
  }

  /**
   * Fetches a specific location by its ID.
   * @param id - The ID of the location to be fetched.
   * @return An Observable emitting the Location entity.
   */
  getLocation(id: string): Observable<Location> {
    return this.locationsEndpoint.getById(id);
  }

  /**
   * Creates a new location.
   * @param location - The Location entity to be created.
   * @return An Observable emitting the created Location entity.
   */
  createLocation(location: Location): Observable<Location> {
    return this.locationsEndpoint.create(location);
  }

  /**
   * Updates an existing location.
   * @param location - The Location entity with updated information.
   * @return An Observable emitting the updated Location entity.
   */
  updateLocation(location: Location): Observable<Location> {
    return this.locationsEndpoint.update(location, location.id);
  }

  /**
   * Deletes a location by its ID.
   * @param id - The ID of the location to be deleted.
   * @return An Observable emitting void upon successful deletion.
   */
  deleteLocation(id: string): Observable<void> {
    return this.locationsEndpoint.delete(id);
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
}
