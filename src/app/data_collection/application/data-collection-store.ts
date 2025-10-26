import {computed, Injectable, Signal, signal} from '@angular/core';
import {Vehicle} from '../domain/model/vehicle.entity';
import {Service} from '../domain/model/service.entity';
import {Visit} from '../domain/model/visit.entity';
import {DataCollectionApi} from '../infrastructure/data-collection-api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';
import {AutoRepair} from '@collections/domain/model/auto-repair.entity';

@Injectable({
  providedIn: 'root'
})
/**
 * Store for managing data related to Vehicles, Auto Repairs, Services, and Visits.
 */
export class DataCollectionStore {
  /**
   * Signal holding the list of Vehicles.
   * @private
   */
  private readonly vehicleSignal = signal<Vehicle[]>([]);
  /**
   * Signal holding the list of Auto Repair registers.
   * @private
   */
  private readonly autoRepairsSignal = signal<AutoRepair[]>([]);
  /**
   * Signal holding the list of Services.
   * @private
   */
  private readonly serviceSignal= signal<Service[]>([]);
  /**
   * Signal holding the list of Visits.
   * @private
   */
  private readonly visitSignal= signal<Visit[]>([]);

  /**
   * Signal exposing the list of Vehicles.
   */
  readonly vehicles = this.vehicleSignal.asReadonly();
  /**
   * Signal exposing the list of Auto Repair registers.
   */
  readonly autoRepairs = this.autoRepairsSignal.asReadonly();
  /**
   * Signal exposing the list of Services.
   */
  readonly services = this.serviceSignal.asReadonly();
  /**
   * Signal exposing the list of Visits.
   */
  readonly visits = this.visitSignal.asReadonly();

  /**
   * Signal indicating the loading state.
   * @private
   */
  private readonly loadingSignal = signal<boolean>(false);
  /**
   * Signal exposing the loading state.
   */
  readonly loading = this.loadingSignal.asReadonly();

  /**
   * Signal holding error messages.
   * @private
   */
  private readonly errorSignal = signal<string | null>(null);
  /**
   * Signal exposing error messages.
   */
  readonly error = this.errorSignal.asReadonly();

  /**
   * Signal exposing the count of Vehicles, Auto Repairs, Services, and Visits.
   */
  readonly vehicleCount = computed(() => this.vehicles().length);
  /**
   * Signal exposing the count of Auto Repair registers.
   */
  readonly autoRepairCount = computed(() => this.autoRepairs().length);
  /**
   * Signal exposing the count of Services.
   */
  readonly serviceCount = computed(() => this.services().length);
  /**
   * Signal exposing the count of Visits.
   */
  readonly visitCount = computed(() => this.visits().length);

  /**
   * Constructs a new instance of the DataCollectionStore and loads initial data.
   * @param dataCollectionApi - The API service for data collection operations.
   */
  constructor(private dataCollectionApi : DataCollectionApi) {
    this.loadVehicles();
    this.loadAutoRepairs();
    this.loadServices();
    this.loadVisits()
  }

  /**
   * Gets a Service by its ID.
   * @param id - The ID of the Service.
   * @returns A signal containing the Service or undefined if not found.
   */
  getServiceById(id: number |string| null | undefined): Signal<Service | undefined> {
    return computed(() => id ? this.services().find(s => s.id === id) : undefined);
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
   * Gets a Vehicle by its ID.
   * @param id - The ID of the Vehicle.
   * @returns A signal containing the Vehicle or undefined if not found.
   */
  getVehicleById(id: number | string | null | undefined): Signal<Vehicle | undefined> {
    return computed(() => id ? this.vehicles().find(c => c.id === id) : undefined);
  }

  /**
   * Gets a Visit by its ID.
   * @param id - The ID of the Visit.
   * @returns A signal containing the Visit or undefined if not found.
   */
  getVisitById(id: number | string | null|undefined): Signal<Visit | undefined> {
    return computed(() => id ? this.visits().find(v => v.id === id) : undefined);
  }

  /**
   * Adds a new Visit.
   * @param visit - The Visit to add.
   * @returns void
   */
  addVisit(visit: Visit): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dataCollectionApi.createVisit(visit).pipe(retry(2)).subscribe({
      next: createVisit => {
        this.visitSignal.set([...this.visits(), createVisit]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create visit'));
        this.loadingSignal.set(false);
      }
    })
  }

  /**
   * Updates an existing Visit.
   * @param visit - The Visit to update.
   * @returns void
   */
  updateVisit(visit: Visit): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dataCollectionApi.updateVisit(visit).pipe(retry(2)).subscribe({
      next: visit => {
        this.visitSignal.update(visits =>
          visits.map(c => c.id === visit.id ? visit : c)
        );
        this.loadingSignal.set(false)
      }
    })
  }

  /**
   * Deletes a Visit by its ID.
   * @param id - The ID of the Visit to delete.
   * @returns void
   */
  deleteVisit(id: number| string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dataCollectionApi.deleteVisit(id).pipe(retry(2)).subscribe({
      next: () => {
        this.visitSignal.update(visits => visits.filter(c => c.id !== id));
        this.loadingSignal.set(false);
      }
    })
  }

  /**
   * Adds a new Auto Repair register.
   * @param autoRepair - The Auto Repair register to add.
   * @returns void
   */
  addAutoRepair(autoRepair: AutoRepair): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dataCollectionApi.createAutoRepair(autoRepair).pipe(retry(2)).subscribe({
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
    this.dataCollectionApi.updateAutoRepair(updatedAutoRepair).pipe(retry(2)).subscribe({
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
    this.dataCollectionApi.deleteAutoRepair(id).pipe(retry(2)).subscribe({
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
   * Adds a new Vehicle.
   * @param vehicle - The Vehicle to add.
   * @returns void
   */
  addVehicle(vehicle: Vehicle): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dataCollectionApi.createVehicle(vehicle).pipe(retry(2)).subscribe({
      next: createdVehicle => {
        this.vehicleSignal.set([...this.vehicles(), createdVehicle]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create vehicle'));
        this.loadingSignal.set(false);
      }
    })
  }

  /**
   * Updates an existing Vehicle.
   * @param vehicle - The Vehicle to update.
   * @returns void
   */
  updateVehicle(vehicle: Vehicle): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dataCollectionApi.updateVehicle(vehicle).pipe(retry(2)).subscribe({
      next: updatedVehicle => {
        this.vehicleSignal.update(vehicles =>
          vehicles.map(c => c.id === updatedVehicle.id ? updatedVehicle : c)
        );
        this.loadingSignal.set(false)
      }
    })
  }

  /**
   * Deletes a Vehicle by its ID.
   * @param id - The ID of the Vehicle to delete.
   * @returns void
   */
  deleteVehicle(id: number| string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dataCollectionApi.deleteVehicle(id).pipe(retry(2)).subscribe({
      next: () => {
        this.vehicleSignal.update(vehicles => vehicles.filter(c => c.id !== id));
        this.loadingSignal.set(false);
      }
    })
  }

  /**
   * Loads the list of Visits.
   * @private
   * @returns void
   */
  private loadVisits(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dataCollectionApi.getVisits().pipe(takeUntilDestroyed()).subscribe({
      next: visits => {
        this.visitSignal.set(visits);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load visits'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Loads the list of Vehicles.
   * @private
   * @returns void
   */
  private loadVehicles(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dataCollectionApi.getVehicles().pipe(takeUntilDestroyed()).subscribe({
      next: vehicles => {
        this.vehicleSignal.set(vehicles);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load vehicles'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Loads the list of Services.
   * @private
   * @returns void
   */
  private loadServices(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dataCollectionApi.getServices().pipe(takeUntilDestroyed()).subscribe({
      next: mainServices => {
        this.serviceSignal.set(mainServices);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load main services'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Loads the list of Auto Repair registers.
   * @private
   * @returns void
   */
  private loadAutoRepairs(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dataCollectionApi.getAutoRepairs()
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
