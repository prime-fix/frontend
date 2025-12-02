import {computed, inject, Injectable, Signal, signal} from '@angular/core';
import {ExpectedVisit} from '@diagnosis/domain/model/expected-visit.entity';
import {DiagnosisApi} from '@diagnosis/infrastructure/diagnosis-api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';
import {Diagnostic} from '@diagnosis/domain/model/diagnostic.entity';
import {TrackingStore} from '@tracking/application/tracking-store';
import {Vehicle} from '@tracking/domain/model/vehicle.entity';

@Injectable({
  providedIn: 'root',
})
export class DiagnosisStore {
  private readonly trackingStore = inject(TrackingStore);
  /**
   * Signal to track expected visits.
   * @private
   * @readonly
   */
  private readonly expectedVisitsSignal = signal<ExpectedVisit[]>([]);

  /**
   * Signal to track diagnostics.
   * @private
   * @readonly
   */
  private readonly diagnosticsSignal = signal<Diagnostic[]>([]);

  /**
   * Readonly version of expected visits signal.
   * @readonly
   */
  readonly expectedVisits = this.expectedVisitsSignal.asReadonly();

  /**
   * Readonly version of diagnostics signal.
   * @readonly
   */
  readonly diagnostics = this.diagnosticsSignal.asReadonly();

  /**
   * Readonly signal for vehicles from TrackingStore.
   * @readonly
   */
  readonly vehicles = this.trackingStore.vehicles;

  /**
   * Signal to track loading state.
   * @private
   * @readonly
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
   * @readonly
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
  readonly expectedVisitCount = computed(() => this.expectedVisits().length);

  /**
   * Computed signal for the count of diagnostics.
   * @readonly
   */
  readonly diagnosticCount = computed(() => this.diagnostics().length);

  /**
   * Computed signal for the count of vehicles.
   * @readonly
   */
  readonly vehicleCount = computed(() => this.trackingStore.vehicleCount());

  /**
   * Constructs a new DiagnosisStore instance and loads initial data.
   * Only loads data if there's a valid JWT session to prevent unnecessary fallback activation
   * @param diagnosisApi - The DiagnosisApi service for API interactions.
   */
  constructor(private diagnosisApi: DiagnosisApi) {
    // Only load data if we have a valid session with JWT
    const hasValidSession = this.hasValidJWT();

    if (hasValidSession) {
      console.log('✅ [DiagnosisStore] Valid JWT found, loading expected visits and diagnostics...');
      this.loadExpectedVisits();
      this.loadDiagnostics();
    } else {
      console.log('⚠️ [DiagnosisStore] No valid JWT, skipping data load on init');
    }

    // Listen for force-load event (triggered after Supabase login)
    if (typeof window !== 'undefined') {
      window.addEventListener('force-load-stores', () => {
        console.log('📤 [DiagnosisStore] Force loading data...');
        this.loadExpectedVisits();
        this.loadDiagnostics();
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
   * Gets an expected visit by its ID.
   * @param id
   */
  getExpectedVisitById(id: number | null | undefined): Signal<ExpectedVisit | undefined> {
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
    this.diagnosisApi.createExpectedVisit(expectedVisit).pipe(retry(2)).subscribe({
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
  updateExpectedVisit(updatedExpectedVisit: ExpectedVisit): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.diagnosisApi.updateExpectedVisit(updatedExpectedVisit).pipe(retry(2)).subscribe({
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
  deleteExpectedVisit(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.diagnosisApi.deleteExpectedVisit(id).pipe(retry(2)).subscribe({
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
   * Gets a diagnostic by its ID.
   * @param id - The ID of the diagnostic to retrieve.
   * @returns A Signal emitting the Diagnostic or undefined if not found.
   */
  getDiagnosticById(id: number | null | undefined): Signal<Diagnostic | undefined> {
    return computed(() => id ? this.diagnostics().find(v => v.id === id) : undefined);
  }

  /**
   * Adds a new diagnostic.
   * @param diagnostic - The diagnostic to add.
   * @returns void
   */
  addDiagnostic(diagnostic: Diagnostic): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.diagnosisApi.createDiagnostic(diagnostic).pipe(retry(2)).subscribe({
      next: createdDiagnostic => {
        this.diagnosticsSignal.set([...this.diagnostics(), createdDiagnostic]);
        this.loadingSignal.set(false);
      },
      error : err => {
        this.errorSignal.set(this.formatError(err, 'Failed to add diagnostic'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Updates an existing diagnostic.
   * @param updatedDiagnostic - The diagnostic with updated data.
   * @returns void
   */
  updateDiagnostic(updatedDiagnostic: Diagnostic): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.diagnosisApi.updateDiagnostic(updatedDiagnostic).pipe(retry(2)).subscribe({
      next: diagnostic => {
        this.diagnosticsSignal.update(diagnostics =>
          diagnostics.map(d => d.id === diagnostic.id ? diagnostic : d));
        this.loadingSignal.set(false);
      },
      error : err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update diagnostic'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Deletes a diagnostic by its ID.
   * @param id - The ID of the diagnostic to delete.
   * @returns void
   */
  deleteDiagnostic(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.diagnosisApi.deleteDiagnostic(id).pipe(retry(2)).subscribe({
      next: () => {
        this.diagnosticsSignal.update(diagnostics =>
          diagnostics.filter(d => d.id !== id));
        this.loadingSignal.set(false);
      },
      error : err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete diagnostic'));
        this.loadingSignal.set(false);
      }
    });
  }

  getVehicleById(id: number | null | undefined): Signal<Vehicle | undefined> {
    return this.trackingStore.getVehicleById(id);
  }

  addVehicle(vehicle: Vehicle): void {
    // Delegate to TrackingStore
    this.trackingStore.addVehicle(vehicle);
  }

  updateVehicle(updatedVehicle: Vehicle): void {
    // Delegate to TrackingStore
    this.trackingStore.updateVehicle(updatedVehicle);
  }

  deleteVehicle(id: number): void {
    // Delegate to TrackingStore
    this.trackingStore.deleteVehicle(id);
  }

  /**
   * Loads expected visits from the API.
   * @private
   * @returns void
   */
  private loadExpectedVisits(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.diagnosisApi.getExpectedVisits().pipe(takeUntilDestroyed()).subscribe({
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
   * Loads diagnostics from the API.
   * @private
   * @return void
   */
  private loadDiagnostics(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.diagnosisApi.getDiagnostics().pipe(takeUntilDestroyed()).subscribe({
      next: diagnostics => {
        console.log(diagnostics);
        this.diagnosticsSignal.set(diagnostics);
        this.loadingSignal.set(false);
      },
      error : err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load diagnostics'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Formats error messages for display.
   * @param error - The error object.
   * @param fallback - The fallback error message.
   * @private
   * @returns The formatted error message.
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
