import { Injectable, computed, signal, Signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';

import { AutoRepairRegister } from '../domain/model/auto-repair-register.entity';
import { TechnicianRegister } from '../domain/model/technician-register.entity';
import { AutoRepairRegisterApi } from '../infrastructure/auto-repair-register-api';

@Injectable({
  providedIn: 'root'
})
export class AutoRepairRegisterStore {
  // ------------------ AutoRepairRegister ------------------
  private readonly autoRepairRegistersSignal = signal<AutoRepairRegister[]>([]);
  readonly autoRepairRegisters = this.autoRepairRegistersSignal.asReadonly();

  // ------------------ TechnicianRegister ------------------
  private readonly techniciansSignal = signal<TechnicianRegister[]>([]);
  readonly technicians = this.techniciansSignal.asReadonly();

  // ------------------ Loading & Error ------------------
  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  constructor(private autoRepairRegisterApi: AutoRepairRegisterApi) {}

  // ======= AutoRepairRegister METHODS ======= //

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

  deleteAutoRepairRegister(id: string | number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.autoRepairRegisterApi.deleteAutoRepairRegister(id)
      .pipe(retry(2))
      .subscribe({
        next: () => {
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

  getAutoRepairRegisterById(id: string | number): Signal<AutoRepairRegister | undefined> {
    return computed(() =>
      this.autoRepairRegisters().find(r => r.id === String(id))
    );
  }

  // ======= TechnicianRegister METHODS ======= //

  loadTechnicians(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.autoRepairRegisterApi.getTechnicians()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (techs) => {
          this.techniciansSignal.set(techs);
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to load technicians'));
          this.loadingSignal.set(false);
        }
      });
  }

  addTechnician(technician: TechnicianRegister): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.autoRepairRegisterApi.createTechnician(technician)
      .pipe(retry(2))
      .subscribe({
        next: (created) => {
          this.techniciansSignal.update(list => [...list, created]);
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to create technician'));
          this.loadingSignal.set(false);
        }
      });
  }

  updateTechnician(technician: TechnicianRegister): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.autoRepairRegisterApi.updateTechnician(technician)
      .pipe(retry(2))
      .subscribe({
        next: (updated) => {
          this.techniciansSignal.update(list =>
            list.map(t => t.id === updated.id ? updated : t)
          );
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to update technician'));
          this.loadingSignal.set(false);
        }
      });
  }

  deleteTechnician(id: string | number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.autoRepairRegisterApi.deleteTechnician(id)
      .pipe(retry(2))
      .subscribe({
        next: () => {
          this.techniciansSignal.update(list =>
            list.filter(t => t.id !== String(id))
          );
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(this.formatError(err, 'Failed to delete technician'));
          this.loadingSignal.set(false);
        }
      });
  }

  getTechnicianById(id: string | number): Signal<TechnicianRegister | undefined> {
    return computed(() =>
      this.technicians().find(t => t.id === String(id))
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
