import {Injectable, computed, signal, Signal, inject, DestroyRef} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry, forkJoin } from 'rxjs';
import {Technician} from '@register/domain/model/technician.entity';
import {RegisterApi} from '@register/infrastructure/register-api';
import {TechnicianSchedule} from '@register/domain/model/technician-schedule.entity';

@Injectable({
  providedIn: 'root'
})
/**
 * Store for managing Technician and Technician Schedule data.
 */
export class RegisterStore {
  /**
   * DestroyRef to clean up subscriptions on destroy.
   * @private
   */
  private destroyRef = inject(DestroyRef);
  /**
   * The Technicians signal.
   * @private
   * @readonly
   */
  private readonly techniciansSignal = signal<Technician[]>([]);

  /**
   * The Technicians as a readonly signal.
   * @readonly
   */
  readonly technicians = this.techniciansSignal.asReadonly();

  /**
   * The Technicians Schedules signal.
   * @private
   * @readonly
   */
  private readonly techniciansSchedulesSignal = signal<TechnicianSchedule[]>([]);

  /**
   * The Technician Schedules as a readonly signal.
   * @readonly
   */
  readonly techniciansSchedules = this.techniciansSchedulesSignal.asReadonly();

  /**
   * The loading state signal.
   * @private
   * @readonly
   */
  private readonly loadingSignal = signal<boolean>(false);

  /**
   * The loading state as a readonly signal.
   * @readonly
   */
  readonly loading = this.loadingSignal.asReadonly();

  /**
   * The error state signal.
   * @private
   * @readonly
   */
  private readonly errorSignal = signal<string | null>(null);

  /**
   * The error state as a readonly signal.
   * @readonly
   */
  readonly error = this.errorSignal.asReadonly();

  /**
   * Constructs a new RegisterStore instance and loads initial data.
   * Only loads data if there's a valid JWT session to prevent unnecessary fallback activation
   * @param autoRepairApi - The RegisterApi service for making API calls.
   */
  constructor(private autoRepairApi: RegisterApi) {
    // Only load data if we have a valid session with JWT
    const hasValidSession = this.hasValidJWT();

    if (hasValidSession) {
      console.log('✅ [RegisterStore] Valid JWT found, loading technicians and schedules...');
      this.loadTechnicians();
      this.loadTechniciansSchedules();
    } else {
      console.log('⚠️ [RegisterStore] No valid JWT, skipping data load on init');
    }

    // Listen for force-load event (triggered after Supabase login)
    if (typeof window !== 'undefined') {
      window.addEventListener('force-load-stores', () => {
        console.log('📤 [RegisterStore] Force loading data...');
        this.loadTechnicians();
        this.loadTechniciansSchedules();
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
   * Gets a Technician by ID.
   * @param id
   */
  getTechnicianById(id: number | undefined): Signal<Technician | undefined> {
    return computed(() => id ? this.technicians().find(t => t.id === id) : undefined);
  }

  /**
   * Loads the list of technicians.
   * @returns void
   */
  private loadTechnicians(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.autoRepairApi.getTechnicians().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (technicians) => {
        this.techniciansSignal.set(technicians);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Failed to load technicians'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Adds a new technician.
   * @param technician - The technician to add.
   * @returns void
   */
  addTechnician(technician: Technician): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.autoRepairApi.createTechnician(technician).pipe(retry(2)).subscribe({
      next: (createdTechnician) => {
        this.techniciansSignal.set([ ...this.technicians(), createdTechnician ]);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Failed to create technician'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Updates an existing technician.
   * @param technician - The technician to update.
   * @returns void
   */
  updateTechnician(technician: Technician): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.autoRepairApi.updateTechnician(technician).pipe(retry(2)).subscribe({
      next: (updatedTechnician) => {
        this.techniciansSignal.update(technicians =>
          technicians.map(t => t.id === updatedTechnician.id ? updatedTechnician : t)
        );
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Failed to update technician'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Deletes a technician by ID.
   * @param id - The ID of the technician to delete.
   * @returns void
   */
  deleteTechnician(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.autoRepairApi.deleteTechnician(id).pipe(retry(2)).subscribe({
      next: () => {
        this.techniciansSignal.update(technicians => technicians.filter(t => t.id !== id));
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete technician'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Deletes a technician and its schedules in a coordinated way.
   * Uses the internal API calls and updates the local signals.
   * @param id - Technician id
   * @returns void
   */
  deleteTechnicianWithSchedules(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const techId = id;
    const schedulesToDelete = this.techniciansSchedules().filter(s => s.technician_id === techId);

    if (schedulesToDelete.length === 0) {
      this.deleteTechnician(techId);
      return;
    }

    const deleteScheduleCalls = schedulesToDelete.map(s =>
      this.autoRepairApi.deleteTechnicianSchedule(s.id).pipe(retry(2))
    );

    forkJoin(deleteScheduleCalls).subscribe({
      next: () => {
        this.techniciansSchedulesSignal.update(schedules =>
          schedules.filter(ts => ts.technician_id !== techId)
        );

        this.autoRepairApi.deleteTechnician(techId).pipe(retry(2)).subscribe({
          next: () => {
            this.techniciansSignal.update(technicians => technicians.filter(t => t.id !== techId));
            this.loadingSignal.set(false);
          },
          error: (err) => {
            this.errorSignal.set(this.formatError(err, 'Failed to delete technician'));
            this.loadingSignal.set(false);
          }
        });
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete technician schedules'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Loads the list of technician schedules.
   * @private
   * @returns void
   */
  private loadTechniciansSchedules(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.autoRepairApi.getTechnicianSchedules().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (schedules) => {
        this.techniciansSchedulesSignal.set(schedules);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Failed to load technician schedules'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Gets a Technician Schedule by ID.
   * @param id - The ID of the Technician Schedule.
   * @returns A signal containing the Technician Schedule or undefined if not found.
   */
  getTechnicianScheduleById(id: number | undefined): Signal<TechnicianSchedule | undefined> {
    return computed(() => id ? this.techniciansSchedules().find(ts => ts.id === id) : undefined);
  }

  /**
   * Adds a new Technician Schedule.
   * @param schedule - The Technician Schedule to add.
   * @returns void
   */
  addTechnicianSchedule(schedule: TechnicianSchedule): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.autoRepairApi.createTechnicianSchedule(schedule).pipe(retry(2)).subscribe({
      next: (createdSchedule) => {
        this.techniciansSchedulesSignal.set([ ...this.techniciansSchedules(), createdSchedule ]);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Failed to create technician schedule'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Updates an existing Technician Schedule.
   * @param schedule - The Technician Schedule to update.
   * @returns void
   */
  updateTechnicianSchedule(schedule: TechnicianSchedule): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.autoRepairApi.updateTechnicianSchedule(schedule).pipe(retry(2)).subscribe({
      next: (updatedSchedule) => {
        this.techniciansSchedulesSignal.update(schedules =>
          schedules.map(ts => ts.id === updatedSchedule.id ? updatedSchedule : ts)
        );
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Failed to update technician schedule'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Deletes a Technician Schedule by ID.
   * @param id - The ID of the Technician Schedule to delete.
   * @returns void
   */
  deleteTechnicianSchedule(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.autoRepairApi.deleteTechnicianSchedule(id).pipe(retry(2)).subscribe({
      next: () => {
        this.techniciansSchedulesSignal.update(schedules => schedules.filter(ts => ts.id !== id));
        this.loadingSignal.set(false);
      },
      error: (err) => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete technician schedule'));
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
