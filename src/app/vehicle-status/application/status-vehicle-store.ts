import {computed, Injectable, Signal, signal} from '@angular/core';
import {StatusVehicle} from '../domain/model/status-vehicle.entity';
import {StatusVehicleApi} from '../infrastructure/status-vehicle-api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StatusVehicleStore {
  private readonly statusVehicleSignal = signal<StatusVehicle[]>([]);

  readonly status = this.statusVehicleSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly statusVehiclesCount = computed(() => this.status().length);

  constructor(private statusVehicleApi: StatusVehicleApi) {
    this.loadStatusVehicle();
  }

  /**
   * Retrieves a status by its ID as a signal.
   * @param id - The ID of the StatusVehicle.
   * @returns A Signal containing the StatusVehicle object or undefined if not found.
   */
  getStatusVehicleById(id: number | null | undefined): Signal<StatusVehicle | undefined> {
    return computed(() => id ? this.status().find(c => c.id === id) : undefined);
  }

  /**
   * Adds a new course.
   * @param status - The status to add.
   */
  addStatusVehicle(status: StatusVehicle): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.statusVehicleApi.createStatusVehicle(status).pipe(retry(2)).subscribe({
      next: createdStatusVehicle => {
        this.statusVehicleSignal.update(status => [...status, createdStatusVehicle]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create Status Vehicle'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Updates an existing status.
   * @param updatedStatusVehicle - The status to update.
   */
  updateStatusVehicle(updatedStatusVehicle: StatusVehicle): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.statusVehicleApi.updateStatusVehicle(updatedStatusVehicle).pipe(retry(2)).subscribe({
      next: statu => {
        this.statusVehicleSignal.update(statusVehicle =>
          statusVehicle.map(c => c.id === statu.id ? statu : c)
        );
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update course'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Deletes a status by ID.
   * @param id - The ID of the StatusVehicle to delete.
   */
  deleteStatusVehicle(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.statusVehicleApi.deleteStatusVehicle(id).pipe(retry(2)).subscribe({
      next: () => {
        this.statusVehicleSignal.update(status  => status .filter(c => c.id !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete course'));
        this.loadingSignal.set(false);
      }
    });
  }


  /**
   * Loads all categories from the API.
   */
  private loadStatusVehicle(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.statusVehicleApi.getStatusVehicles().pipe(takeUntilDestroyed()).subscribe({
      next: status => {
        console.log(status);
        this.statusVehicleSignal.set(status);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load categories'));
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
