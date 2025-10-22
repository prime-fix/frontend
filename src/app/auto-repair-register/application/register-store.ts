import { Injectable, computed, signal, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';
import {AutoRepair} from '@register/domain/model/auto-repair.entity';
import {Technician} from '@register/domain/model/technician.entity';
import {RegisterApi} from '@register/infrastructure/register-api';

@Injectable({
  providedIn: 'root'
})
/**
 * Store for managing Auto Repair and Technician registers.
 */
export class RegisterStore {
  /**
   * The Auto Repair registers signal.
   * @private
   */
  private readonly autoRepairsSignal = signal<AutoRepair[]>([]);

  /**
   * The Auto Repair registers as a readonly signal.
   */
  readonly autoRepairs = this.autoRepairsSignal.asReadonly();

  /**
   * The Technicians signal.
   * @private
   */
  private readonly techniciansSignal = signal<Technician[]>([]);

  /**
   * The Technicians as a readonly signal.
   */
  readonly technicians = this.techniciansSignal.asReadonly();

  /**
   * The loading state signal.
   * @private
   */
  private readonly loadingSignal = signal<boolean>(false);
  /**
   * The loading state as a readonly signal.
   */
  readonly loading = this.loadingSignal.asReadonly();

  /**
   * The error state signal.
   * @private
   */
  private readonly errorSignal = signal<string | null>(null);

  /**
   * The error state as a readonly signal.
   */
  readonly error = this.errorSignal.asReadonly();


  constructor(private autoRepairApi: RegisterApi) {
    this.loadAutoRepairs();
    this.loadTechnicians();
  }

  /**
   * Gets an Auto Repair register by its ID.
   * @param id - The ID of the Auto Repair register.
   * @returns A signal containing the Auto Repair register or undefined if not found.
   */
  getAutoRepairById(id: string | number | undefined): Signal<AutoRepair | undefined> {
    return computed(() => id ? this.autoRepairs().find(ar => ar.id === String(id)) : undefined);
  }

  /**
   * Loads the list of Auto Repair registers.
   * @returns void
   */
  private loadAutoRepairs(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.autoRepairApi.getAutoRepairs()
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
   * Adds a new Auto Repair register.
   * @param autoRepair - The Auto Repair register to add.
   * @returns void
   */
  addAutoRepair(autoRepair: AutoRepair): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.autoRepairApi.createAutoRepair(autoRepair).pipe(retry(2)).subscribe({
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
    this.autoRepairApi.updateAutoRepair(updatedAutoRepair).pipe(retry(2)).subscribe({
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
  deleteAutoRepairRegister(id: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.autoRepairApi.deleteAutoRepair(id).pipe(retry(2)).subscribe({
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
