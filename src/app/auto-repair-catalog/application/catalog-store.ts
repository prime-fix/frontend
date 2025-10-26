import {computed, Injectable, Signal, signal} from '@angular/core';
import {ExpectedVisit} from '@catalog/domain/model/expected-visit.entity';
import {Location} from '@catalog/domain/model/location.entity';
import {CatalogApi} from '@catalog/infrastructure/catalog-api';
import {retry} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class CatalogStore {
  /**
   * Signal to track expected visits.
   * @private
   */
  private readonly expectedVisitsSignal = signal<ExpectedVisit[]>([]);

  /**
   * Readonly version of expected visits signal.
   */
  readonly expectedVisits = this.expectedVisitsSignal.asReadonly();

  /**
   * Signal to track locations.
   * @private
   */
  private readonly locationsSignal = signal<Location[]>([]);

  /**
   * Readonly version of locations signal.
   */
  readonly locations = this.locationsSignal.asReadonly();

  /**
   * Signal to track loading state.
   * @private
   */
  private readonly loadingSignal = signal<boolean>(false);
  /**
   * Readonly version of loading signal.
   */
  readonly loading = this.loadingSignal.asReadonly();

  /**
   * Signal to track error messages.
   * @private
   */
  private readonly errorSignal = signal<string | null>(null);
  /**
   * Readonly version of error signal.
   */
  readonly error = this.errorSignal.asReadonly();

  /**
   * Computed signal for the count of expected visits.
   */
  readonly expectedVisitCount = computed(() => this.expectedVisits().length);

  /**
   * Computed signal for the count of locations.
   */
  readonly locationCount = computed(() => this.locations().length);

  /**
   * Creates an instance of CatalogStore and loads expected visits.
   * @param catalogApi - The Catalog API service.
   */
  constructor(private catalogApi: CatalogApi) {
    this.loadExpectedVisits();
    this.loadLocations();
  }

  /**
   * Gets an expected visit by its ID.
   * @param id
   */
  getExpectedVisitById(id: string | null | undefined): Signal<ExpectedVisit | undefined> {
    return computed(() => id ? this.expectedVisits().find(v => v.id === id) : undefined);
  }

  /**
   * Adds a new expected visit.
   * @param expectedVisit - The expected visit to add.
   * @returns void
   */
  addExpectedVisit(expectedVisit: ExpectedVisit): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.catalogApi.createExpectedVisit(expectedVisit).pipe(retry(2)).subscribe({
      next: createdExpectedVisit => {
        this.expectedVisitsSignal.set([...this.expectedVisits(), createdExpectedVisit]);
        this.loadingSignal.set(false);
      },
      error : err => {
        this.errorSignal.set(this.formatError(err, 'Failed to add expected visit'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Updates an existing expected visit.
   * @param updatedExpectedVisit - The expected visit with updated data.
   * @returns void
   */
  updatedExpectedVisit(updatedExpectedVisit: ExpectedVisit): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.catalogApi.updateExpectedVisit(updatedExpectedVisit).pipe(retry(2)).subscribe({
      next: expectedVisit => {
        this.expectedVisitsSignal.update(expectedVisits =>
        expectedVisits.map(ev => ev.id === expectedVisit.id ? expectedVisit : ev));
        this.loadingSignal.set(false);
      },
      error : err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update expected visit'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Deletes an expected visit by its ID.
   * @param id - The ID of the expected visit to delete.
   * @returns void
   */
  deleteExpectedVisit(id: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.catalogApi.deleteExpectedVisit(id).pipe(retry(2)).subscribe({
      next: () => {
        this.expectedVisitsSignal.update(expectedVisits =>
          expectedVisits.filter(ev => ev.id !== id));
        this.loadingSignal.set(false);
      },
      error : err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete expected visit'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Gets a location by its ID.
   * @param id - The ID of the location to retrieve.
   */
  getLocationById(id: string | null  | undefined): Signal<Location | undefined> {
    return computed(() => id ? this.locations().find(l => l.id === id) : undefined);
  }

  /**
   * Adds a new location.
   * @param location - The location to add.
   */
  addLocation(location: Location): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.catalogApi.createLocation(location).pipe(retry(2)).subscribe({
      next: createdLocation => {
        this.locationsSignal.set([...this.locations(), createdLocation]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create location'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Updates an existing location.
   * @param location - The location with updated information.
   */
  updateLocation(location: Location): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.catalogApi.updateLocation(location).pipe(retry(2)).subscribe({
      next: updatedLocation => {
        this.locationsSignal.update(locations =>
          locations.map(l => l.id === updatedLocation.id ? updatedLocation : l))
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update location'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Deletes a location by ID.
   * @param id - The ID of the location to delete.
   */
  deleteLocation(id: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.catalogApi.deleteLocation(id).pipe(retry(2)).subscribe({
      next: () => {
        this.locationsSignal.update(locations => locations.filter(l => l.id !== id))
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete location'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Loads expected visits from the API.
   * @returns void
   * @private
   */
  private loadExpectedVisits(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.catalogApi.getExpectedVisits().pipe(takeUntilDestroyed()).subscribe({
      next: expectedVisits => {
        console.log(expectedVisits);
        this.expectedVisitsSignal.set(expectedVisits);
        this.loadingSignal.set(false);
      },
      error : err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load expected visits'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Loads locations from the API and updates the state signal.
   * @private - This method is intended for internal use only.
   */
  private loadLocations(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.catalogApi.getLocations().pipe(takeUntilDestroyed()).subscribe({
      next: locations => {
        console.log(locations);
        this.locationsSignal.set(locations);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load locations'));
        this.loadingSignal.set(false);
      }
    })
  }

  /**
   * Formats error messages for user-friendly display.
   * @param error - The error object.
   * @param fallback - The fallback error message.
   * @returns A formatted error message.
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
