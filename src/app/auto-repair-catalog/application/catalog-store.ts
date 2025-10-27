import {computed, inject, Injectable, Signal, signal} from '@angular/core';
import {ExpectedVisit} from '@diagnosis/domain/model/expected-visit.entity';
import {Location} from '@catalog/domain/model/location.entity';
import {CatalogApi} from '@catalog/infrastructure/catalog-api';
import {retry} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DiagnosisStore} from '@diagnosis/application/diagnosis-store';
import {AutoRepair} from '@catalog/domain/model/auto-repair.entity';

@Injectable({
  providedIn: 'root'
})
export class CatalogStore {
  /**
   * DiagnosisView store instance for managing expected visits.
   * @private
   */
  private readonly diagnosisStore = inject(DiagnosisStore);

  /**
   * Readonly version of expected visits signal.
   * @readonly
   */
  readonly expectedVisits = this.diagnosisStore.expectedVisits;

  /**
   * Signal to track locations.
   * @private
   */
  private readonly locationsSignal = signal<Location[]>([]);

  /**
   * Signal holding the list of Auto Repair registers.
   * @private
   */
  private readonly autoRepairsSignal = signal<AutoRepair[]>([]);

  /**
   * Readonly version of locations signal.
   * @readonly
   */
  readonly locations = this.locationsSignal.asReadonly();

  /**
   * Signal exposing the list of Auto Repair registers.
   */
  readonly autoRepairs = this.autoRepairsSignal.asReadonly();

  /**
   * Signal to track loading state.
   * @private
   */
  private readonly loadingSignal = signal<boolean>(false);
  /**
   * Readonly version of loading signal.
   * @readonly
   */
  readonly loading = this.loadingSignal.asReadonly();

  /**
   * Signal to track error messages.
   * @private
   */
  private readonly errorSignal = signal<string | null>(null);
  /**
   * Readonly version of error signal.
   * @readonly
   */
  readonly error = this.errorSignal.asReadonly();

  /**
   * Computed signal for the count of expected visits.
   * @readonly
   */
  readonly expectedVisitCount = computed(() => this.diagnosisStore.expectedVisitCount());

  /**
   * Computed signal for the count of locations.
   * @readonly
   */
  readonly locationCount = computed(() => this.locations().length);

  /**
   * Signal exposing the count of Auto Repair registers.
   */
  readonly autoRepairCount = computed(() => this.autoRepairs().length);

  /**
   * Creates an instance of CatalogStore and loads expected visits.
   * @param catalogApi - The Catalog API service.
   */
  constructor(private catalogApi: CatalogApi) {
    this.loadLocations();
    this.loadAutoRepairs();
  }

  /**
   * Gets an expected visit by its ID.
   * @param id
   */
  getExpectedVisitById(id: string | null | undefined): Signal<ExpectedVisit | undefined> {
    // Delegate to DiagnosisStore
    return this.diagnosisStore.getExpectedVisitById(id);
  }

  /**
   * Adds a new expected visit.
   * @param expectedVisit - The expected visit to add.
   * @returns void
   */
  addExpectedVisit(expectedVisit: ExpectedVisit): void {
    // Delegate to DiagnosisStore
    this.diagnosisStore.addExpectedVisit(expectedVisit);
  }

  /**
   * Updates an existing expected visit.
   * @param updatedExpectedVisit - The expected visit with updated data.
   * @returns void
   */
  updatedExpectedVisit(updatedExpectedVisit: ExpectedVisit): void {
    // Delegate to DiagnosisStore
    this.diagnosisStore.updateExpectedVisit(updatedExpectedVisit);
  }

  /**
   * Deletes an expected visit by its ID.
   * @param id - The ID of the expected visit to delete.
   * @returns void
   */
  deleteExpectedVisit(id: string): void {
    // Delegate to DiagnosisStore
    this.diagnosisStore.deleteExpectedVisit(id);
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
   * Gets an Auto Repair register by its ID.
   * @param id - The ID of the Auto Repair register.
   * @returns A signal containing the Auto Repair register or undefined if not found.
   */
  getAutoRepairById(id: string | number | null | undefined): Signal<AutoRepair | undefined> {
    return computed(() => id ? this.autoRepairs().find(ar => ar.id === String(id)) : undefined);
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
   * Adds a new Auto Repair register.
   * @param autoRepair - The Auto Repair register to add.
   * @returns void
   */
  addAutoRepair(autoRepair: AutoRepair): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.catalogApi.createAutoRepair(autoRepair).pipe(retry(2)).subscribe({
      next: (createdAutoRepair) => {
        this.autoRepairsSignal.set([...this.autoRepairs(), createdAutoRepair]);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Failed to create auto repair'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Updates an existing Auto Repair register.
   * @param updatedAutoRepair - The Auto Repair register to update.
   * @returns void
   */
  updateAutoRepair(updatedAutoRepair: AutoRepair): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.catalogApi.updateAutoRepair(updatedAutoRepair).pipe(retry(2)).subscribe({
      next: (autoRepair) => {
        this.autoRepairsSignal.update(autoRepairs =>
          autoRepairs.map(ar => ar.id === autoRepair.id ? autoRepair : ar)
        );
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Failed to update auto repair'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Deletes an Auto Repair register by its ID.
   * @param id - The ID of the Auto Repair register to delete.
   */
  deleteAutoRepair(id: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.catalogApi.deleteAutoRepair(id).pipe(retry(2)).subscribe({
      next: () => {
        this.autoRepairsSignal.update(autoRepairs => autoRepairs.filter(ar => ar.id !== id));
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete register'));
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
   * Loads the list of Auto Repair registers.
   * @private
   * @returns void
   */
  private loadAutoRepairs(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.catalogApi.getAutoRepairs()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (autoRepairs) => {
          this.autoRepairsSignal.set(autoRepairs);
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to load auto repairs'));
          this.loadingSignal.set(false);
        }
      });
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
