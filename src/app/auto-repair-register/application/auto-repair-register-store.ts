import { Injectable, computed, signal, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';

import { AutoRepairRegister } from '../domain/model/auto-repair-register.entity';
import { AutoRepairRegisterApi } from '../infrastructure/auto-repair-register-api';

@Injectable({
  providedIn: 'root'
})
export class AutoRepairRegisterStore {
  private readonly autoRepairRegistersSignal = signal<AutoRepairRegister[]>([]);
  readonly autoRepairRegisters = this.autoRepairRegistersSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  constructor(private autoRepairRegisterApi: AutoRepairRegisterApi) {}

  // ======= METHODS ======= //

  /** Loads all auto repair registers from the backend */
  loadAutoRepairRegisters(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.autoRepairRegisterApi.getAutoRepairRegisters()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (registers) => {
          this.autoRepairRegistersSignal.set(registers);
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to load registers'));
          this.loadingSignal.set(false);
        }
      });
  }

  /** Creates a new auto repair register and adds it to the state */
  addAutoRepairRegister(register: AutoRepairRegister): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.autoRepairRegisterApi.createAutoRepairRegister(register)
      .pipe(retry(2))
      .subscribe({
        next: (created) => {
          this.autoRepairRegistersSignal.update(list => [...list, created]);
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to create register'));
          this.loadingSignal.set(false);
        }
      });
  }

  /** Updates an existing auto repair register */
  updateAutoRepairRegister(register: AutoRepairRegister): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.autoRepairRegisterApi.updateAutoRepairRegister(register)
      .pipe(retry(2))
      .subscribe({
        next: (updated) => {
          this.autoRepairRegistersSignal.update(list =>
            list.map(r => r.id === updated.id ? updated : r)
          );
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to update register'));
          this.loadingSignal.set(false);
        }
      });
  }

  /** Deletes a register by its ID */
  deleteAutoRepairRegister(id: string | number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.autoRepairRegisterApi.deleteAutoRepairRegister(id)
      .pipe(retry(2))
      .subscribe({
        next: () => {
          // Compare as strings because entity.id is string
          this.autoRepairRegistersSignal.update(list =>
            list.filter(r => r.id !== String(id))
          );
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to delete register'));
          this.loadingSignal.set(false);
        }
      });
  }

  /** Returns a reactive signal for a specific register already loaded in memory */
  getAutoRepairRegisterById(id: string | number): Signal<AutoRepairRegister | undefined> {
    // Compare as strings because entity.id is string
    return computed(() =>
      this.autoRepairRegisters().find(r => r.id === String(id))
    );
  }

  // ======= HELPER METHODS ======= //
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found')
        ? `${fallback}: Not found`
        : error.message;
    }
    return fallback;
  }
}
