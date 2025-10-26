import {Injectable} from '@angular/core';
import {BaseApi} from '@shared/infrastructure/http/base-api';
import {ExpectedVisitsApiEndpoint} from '@catalog/infrastructure/expected-visits-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ExpectedVisit} from '@catalog/domain/model/expected-visit.entity';
import {Location} from '@catalog/domain/model/location.entity';
import {LocationApiEndpoint} from '@catalog/infrastructure/location-api-endpoint';

/**
 * Catalog API service that provides methods to interact with the AutoRepair catalog backend.
 * It uses the ExpectedVisitsApiEndpoint to perform CRUD operations on expected visits.
 */
@Injectable({
  providedIn: 'root',
})
export class CatalogApi extends BaseApi {
  /**
   * API endpoint for expected visits.
   * @private
   * @readonly
   */
  private readonly expectedVisitsEndpoint: ExpectedVisitsApiEndpoint;

  /**
   * API endpoint for location-related operations.
   * @private
   */
  private readonly locationsEndpoint: LocationApiEndpoint;

  /**
   * Constructor to initialize the Catalog API service with the ExpectedVisitsApiEndpoint.
   * @param http - The HttpClient instance for making HTTP requests.
   */
  constructor(http: HttpClient) {
    super();
    this.expectedVisitsEndpoint = new ExpectedVisitsApiEndpoint(http);
    this.locationsEndpoint = new LocationApiEndpoint(http);
  }

  /**
   * Fetches all expected visits from the backend.
   * @returns An Observable emitting an array of ExpectedVisit entities.
   */
  getExpectedVisits(): Observable<ExpectedVisit[]> {
    return this.expectedVisitsEndpoint.getAll();
  }

  /**
   * Fetches a specific expected visit by its ID.
   * @param id - The ID of the expected visit to fetch.
   * @returns An Observable emitting the ExpectedVisit entity.
   */
  getExpectedVisitById(id: string): Observable<ExpectedVisit> {
    return this.expectedVisitsEndpoint.getById(id);
  }

  /**
   * Creates a new expected visit in the backend.
   * @param expectedVisit - The ExpectedVisit entity to create.
   * @returns An Observable emitting the created ExpectedVisit entity.
   */
  createExpectedVisit(expectedVisit: ExpectedVisit): Observable<ExpectedVisit> {
    return this.expectedVisitsEndpoint.create(expectedVisit);
  }

  /**
   * Updates an existing expected visit in the backend.
   * @param expectedVisit - The ExpectedVisit entity to update.
   * @returns An Observable emitting the updated ExpectedVisit entity.
   */
  updateExpectedVisit(expectedVisit: ExpectedVisit): Observable<ExpectedVisit> {
    return this.expectedVisitsEndpoint.update(expectedVisit, expectedVisit.id);
  }

  /**
   * Deletes an expected visit by its ID.
   * @param id - The ID of the expected visit to delete.
   * @returns An Observable emitting void upon successful deletion.
   */
  deleteExpectedVisit(id: string): Observable<void> {
    return this.expectedVisitsEndpoint.delete(id);
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
}
