import {computed, inject, Injectable, Signal, signal} from '@angular/core';
import {ExpectedVisit} from '@diagnosis/domain/model/expected-visit.entity';
import {Location} from '@catalog/domain/model/location.entity';
import {CatalogApi} from '@catalog/infrastructure/catalog-api';
import {retry, take} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {DiagnosisStore} from '@diagnosis/application/diagnosis-store';
import {AutoRepair} from '@catalog/domain/model/auto-repair.entity';
import {Service} from '@catalog/domain/model/service.entity';
import {ServiceOffer} from '@catalog/domain/model/service-offer.entity';

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
   * Signal holding the list of Services.
   * @private
   */
  private readonly serviceSignal= signal<Service[]>([]);

  /**
   * Signal holding the list of Auto Repair registers.
   * @private
   */
  private readonly autoRepairsSignal = signal<AutoRepair[]>([]);

  private readonly serviceOffersSignal = signal<ServiceOffer[]>([]);

  /**
   * Readonly version of locations signal.
   * @readonly
   */
  readonly locations = this.locationsSignal.asReadonly();


  readonly serviceOffers = this.serviceOffersSignal.asReadonly();
  /**
   * Signal exposing the list of Services.
   */
  readonly services = this.serviceSignal.asReadonly();

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

  readonly serviceOfferCount = computed(() => this.serviceOffers().length);

  /**
   * Computed signal for the count of locations.
   * @readonly
   */
  readonly locationCount = computed(() => this.locations().length);

  /**
   * Signal exposing the count of Services.
   */
  readonly serviceCount = computed(() => this.services().length);

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
    this.loadServices();
  }

  /**
   * Gets an expected visit by its ID.
   * @param id
   */
  getExpectedVisitById(id: string | null | undefined): Signal<ExpectedVisit | undefined> {
    // Delegate to DiagnosisStore
    return this.diagnosisStore.getExpectedVisitById(id);
  }

  getServiceOfferById(id: number | string | null | undefined): Signal<ServiceOffer | undefined> {
    return computed(() => id ? this.serviceOffers().find(so => so.id === id) : undefined);
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
   * Gets a Service by its ID.
   * @param id - The ID of the Service.
   * @returns A signal containing the Service or undefined if not found.
   */
  getServiceById(id: number |string| null | undefined): Signal<Service | undefined> {
    return computed(() => id ? this.services().find(s => s.id === id) : undefined);
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

  addService(service:Service):void{
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.catalogApi.createService(service).pipe(retry(2)).subscribe({
      next: createdService =>{
        this.serviceSignal.set([...this.services(), createdService]);
        this.loadingSignal.set(false);
      },
      error:err => {
        this.errorSignal.set(this.formatError(err,'Failed to create service'));
        this.loadingSignal.set(false);
      }
    })
  }

  loadServiceOffers(autoRepairId: number | string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.catalogApi.getServiceOffersByAutoRepairsId(autoRepairId)
      .subscribe({
        next: (offers) => {
          this.serviceOffersSignal.set(offers);
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(
            this.formatError(err, `Failed to load offers for auto repair ${autoRepairId}`)
          );
          this.loadingSignal.set(false);
        }
      });
  }

  addServiceOffer(autoRepairId: number | string, payload: any): void {
    if (this.loadingSignal()) {
      return;
    }

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.catalogApi.addServiceOffer(autoRepairId, payload)
      .pipe(
        take(1)
      )
      .subscribe({
        next: (responseFromApi: any) => {
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.loadingSignal.set(false);
        }
      });
  }

  deleteServiceOffer(autoRepairId: number | string, serviceOfferId: number | string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.catalogApi.deleteServiceOffer(autoRepairId, serviceOfferId).pipe(retry(2)).subscribe({
      next: () => {
        this.serviceOffersSignal.update(offers => offers.filter(o => o.id !== serviceOfferId));
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete service offer'));
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
    this.catalogApi.getServices().pipe(takeUntilDestroyed()).subscribe({
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

  deleteService(id:string):void{
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    const idNumber = Number(id);
    this.catalogApi.deleteService(id).pipe(retry(2)).subscribe({
      next: () => {
        this.serviceSignal.update(service => service.filter(l => l.id !== id))
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete service'));
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

  getAutoRepairIdByUserId(userId: string | null | undefined): Signal<string | undefined> {
    return computed(() => {
      if (!userId) return undefined;

      const autoRepair = this.autoRepairs().find(ar => ar.id_user_account === userId);
      return autoRepair?.id;
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
    if (error && error.error && error.error.message) {
      return error.error.message;
    }
    if (error && error.message) {
      return error.message;
    }
    if (error && error.error) {
      try {
        const apiError = JSON.parse(error.error);
        return apiError.message || fallback;
      } catch (e) {
        return error.error;
      }
    }

    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
