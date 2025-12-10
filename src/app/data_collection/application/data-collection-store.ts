import {computed, DestroyRef, inject, Injectable, Signal, signal} from '@angular/core';
import {Service} from '../domain/model/service.entity';
import {Visit} from '../domain/model/visit.entity';
import {DataCollectionApi} from '../infrastructure/data-collection-api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * Store for managing data related to Vehicles, Auto Repairs, Services, and Visits.
 */
export class DataCollectionStore {
  /**
   * DestroyRef to clean up subscriptions on destroy.
   * @private
   */
  private destroyRef = inject(DestroyRef);
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
   * Signal exposing the count of Services.
   */
  readonly serviceCount = computed(() => this.services().length);
  /**
   * Signal exposing the count of Visits.
   */
  readonly visitCount = computed(() => this.visits().length);

  /**
   * Constructs a new instance of the DataCollectionStore and loads initial data.
   * Only loads data if there's a valid JWT session to prevent unnecessary fallback activation
   * @param dataCollectionApi - The API service for data collection operations.
   */
  constructor(private dataCollectionApi : DataCollectionApi) {
    // Only load data if we have a valid session with JWT
    const hasValidSession = this.hasValidJWT();

    if (hasValidSession) {
      console.log('✅ [DataCollectionStore] Valid JWT found, loading services and visits...');
      this.loadServices();
      this.loadVisits();
    } else {
      console.log('⚠️ [DataCollectionStore] No valid JWT, skipping data load on init');
    }

    // Listen for force-load event (triggered after Supabase login)
    if (typeof window !== 'undefined') {
      window.addEventListener('force-load-stores', () => {
        console.log('📤 [DataCollectionStore] Force loading data...');
        this.loadServices();
        this.loadVisits();
      });
    }
  }

  /**
   * Check if there's a valid JWT in localStorage
   * @private
   */
  private hasValidJWT(): boolean {
    try {
      const authData = localStorage.getItem('pf_iam_auth');
      if (!authData) return false;

      const parsed = JSON.parse(authData);
      return !!parsed?.token?.accessToken;
    } catch {
      return false;
    }
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
  deleteVisit(id: number): void {
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
   * Loads the list of Visits.
   * @private
   * @returns void
   */
  private loadVisits(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dataCollectionApi.getVisits().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
   * Loads the list of Services.
   * @private
   * @returns void
   */
  private loadServices(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dataCollectionApi.getServices().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
