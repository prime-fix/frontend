import {Injectable, computed, signal, Signal, inject} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry, forkJoin } from 'rxjs';
import {Technician} from '@register/domain/model/technician.entity';
import {RegisterApi} from '@register/infrastructure/register-api';
import {TechnicianSchedule} from '@register/domain/model/technician-schedule.entity';
import {DataCollectionStore} from '@collections/application/data-collection-store';
import {AutoRepair} from '@collections/domain/model/auto-repair.entity';

@Injectable({
  providedIn: 'root'
})
/**
 * Store for managing Technician and Technician Schedule data.
 */
export class RegisterStore {
  private readonly dataCollectionStore = inject(DataCollectionStore);

  /**
   * The Auto Repair registers as a readonly signal.
   * @readonly
   */
  readonly autoRepairs = this.dataCollectionStore.autoRepairs;

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

  constructor(private autoRepairApi: RegisterApi) {
    this.loadTechnicians();
    this.loadTechniciansSchedules();
  }

  /**
   * Gets an Auto Repair by ID.
   * @param id - The ID of the Auto Repair.
   * @returns A signal containing the Auto Repair or undefined if not found.
   */
  getAutoRepairById(id: string | number | undefined): Signal<AutoRepair | undefined> {
    // Delegates to the DataCollectionStore to get the Auto Repair by ID.
    return this.dataCollectionStore.getAutoRepairById(id);
  }

  /**
   * Adds a new Auto Repair.
   * @param autoRepair - The Auto Repair to add.
   * @returns void
   */
  addAutoRepair(autoRepair: AutoRepair): void {
    // Delegates to the DataCollectionStore to add the Auto Repair.
    this.dataCollectionStore.addAutoRepair(autoRepair);
  }

  /**
   * Updates an existing Auto Repair.
   * @param autoRepair - The Auto Repair to update.
   * @returns void
   */
  updateAutoRepair(autoRepair: AutoRepair): void {
    // Delegates to the DataCollectionStore to update the Auto Repair.
    this.dataCollectionStore.updateAutoRepair(autoRepair);
  }

  /**
   * Deletes an Auto Repair by ID.
   * @param id - The ID of the Auto Repair to delete.
   * @returns void
   */
  deleteAutoRepair(id: string): void {
    // Delegates to the DataCollectionStore to delete the Auto Repair.
    this.dataCollectionStore.deleteAutoRepair(id);
  }

  /**
   * Gets a Technician by ID.
   * @param id
   */
  getTechnicianById(id: string | number | undefined): Signal<Technician | undefined> {
    return computed(() => id ? this.technicians().find(t => t.id === id) : undefined);
  }

  /**
   * Loads the list of technicians.
   * @returns void
   */
  private loadTechnicians(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.autoRepairApi.getTechnicians().pipe(takeUntilDestroyed()).subscribe({
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
  deleteTechnician(id: string | number): void {
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
  deleteTechnicianWithSchedules(id: string | number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const techId = id;
    const schedulesToDelete = this.techniciansSchedules().filter(s => s.id_technician === techId);

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
          schedules.filter(ts => ts.id_technician !== techId)
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
    this.autoRepairApi.getTechnicianSchedules().pipe(takeUntilDestroyed()).subscribe({
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
  getTechnicianScheduleById(id: string | number | undefined): Signal<TechnicianSchedule | undefined> {
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
  deleteTechnicianSchedule(id: string | number): void {
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
