import {computed, inject, Injectable, Signal, signal} from '@angular/core';
import {Vehicle} from '@tracking/domain/model/vehicle.entity';
import {Service} from '@catalog/domain/model/service.entity';
import {Visit} from '../domain/model/visit.entity';
import {DataCollectionApi} from '../infrastructure/data-collection-api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';
import {AutoRepair} from '@catalog/domain/model/auto-repair.entity';
import {CatalogStore} from '@catalog/application/catalog-store';
import {TrackingStore} from '@tracking/application/tracking-store';
import {CatalogApi} from '@catalog/infrastructure/catalog-api';

@Injectable({
  providedIn: 'root'
})
/**
 * Store for managing data related to Vehicles, Auto Repairs, Services, and Visits.
 */
export class DataCollectionStore {
  private readonly catalogStore = inject(CatalogStore);
  private readonly trackingStore = inject(TrackingStore);
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
  readonly vehicles = this.trackingStore.vehicles;
  /**
   * Signal exposing the list of Auto Repair registers.
   */
  readonly autoRepairs = this.catalogStore.autoRepairs;
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
  readonly vehicleCount = computed(() => this.trackingStore.vehicleCount());
  /**
   * Signal exposing the count of Auto Repair registers.
   */
  readonly autoRepairCount = computed(() => this.catalogStore.autoRepairCount());
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
    this.loadVisits()
  }


  /**
   * Gets an Auto Repair register by its ID.
   * @param id - The ID of the Auto Repair register.
   * @returns A signal containing the Auto Repair register or undefined if not found.
   */
  getAutoRepairById(id: string | number | null | undefined): Signal<AutoRepair | undefined> {
    // Delegate to CatalogStore
    return this.catalogStore.getAutoRepairById(id);
  }

  /**
   * Gets a Vehicle by its ID.
   * @param id - The ID of the Vehicle.
   * @returns A signal containing the Vehicle or undefined if not found.
   */
  getVehicleById(id: number | string | null | undefined): Signal<Vehicle | undefined> {
    // Delegate to TrackingStore
    return this.trackingStore.getVehicleById(id);
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
  deleteVisit(id: string): void {
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
    // Delegate to CatalogStore
    this.catalogStore.addAutoRepair(autoRepair);
  }

  /**
   * Updates an existing Auto Repair register.
   * @param updatedAutoRepair - The Auto Repair register to update.
   * @returns void
   */
  updateAutoRepair(updatedAutoRepair: AutoRepair): void {
    // Delegate to CatalogStore
    this.catalogStore.updateAutoRepair(updatedAutoRepair);
  }

  /**
   * Deletes an Auto Repair register by its ID.
   * @param id - The ID of the Auto Repair register to delete.
   */
  deleteAutoRepair(id: string): void {
    // Delegate to CatalogStore
    this.catalogStore.deleteAutoRepair(id);
  }

  /**
   * Adds a new Vehicle.
   * @param vehicle - The Vehicle to add.
   * @returns void
   */
  addVehicle(vehicle: Vehicle): void {
    // Delegate to TrackingStore
    this.trackingStore.addVehicle(vehicle);
  }

  /**
   * Updates an existing Vehicle.
   * @param vehicle - The Vehicle to update.
   * @returns void
   */
  updateVehicle(vehicle: Vehicle): void {
    // Delegate to TrackingStore
    this.trackingStore.updateVehicle(vehicle);
  }

  /**
   * Deletes a Vehicle by its ID.
   * @param id - The ID of the Vehicle to delete.
   * @returns void
   */
  deleteVehicle(id: number| string): void {
    // Delegate to TrackingStore
    this.trackingStore.deleteVehicle(id);
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
