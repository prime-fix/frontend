import {computed, Injectable, Signal, signal} from '@angular/core';
import {Vehicle} from '../domain/model/vehicle.entity';
import {MainService} from '../domain/model/service.entity';
import {Repair} from '../domain/model/auto-repair.entity';
import {Visit} from '../domain/model/visit.entity';
import {DataCollectionApi} from '../infrastructure/data-collection-api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataCollection {

  private readonly vehicleSignal = signal<Vehicle[]>([]);
  private readonly repairSignal = signal<Repair[]>([]);
  private readonly serviceSignal= signal<MainService[]>([]);
  private readonly visitSignal= signal<Visit[]>([]);

  readonly vehicles = this.vehicleSignal.asReadonly();
  readonly repairs = this.repairSignal.asReadonly()
  readonly services = this.serviceSignal.asReadonly();
  readonly visits = this.visitSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  constructor(private dataApi : DataCollectionApi) {
    this.loadVehicles();
    this.loadRepairs();
    this.loadServices();
    this.loadVisits()
  }
  private formatError(error: any, fallbackMessage: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? 'Resource not found' : error.message;
    }
    return fallbackMessage
  }

  getVehicleById(id: number | null|undefined): Signal<Vehicle | undefined> {
    return computed(() => id ? this.vehicles().find(c => c.id === id) : undefined);
  }

  addVisit(visit: Visit): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dataApi.createVisit(visit).pipe(retry(2)).subscribe({
      next: createVisit => {
        this.visitSignal.update(visits => [...visits, createVisit]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create visit'));
        this.loadingSignal.set(false);
      }
    })
  }

  updateVisit(visit: Visit): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dataApi.updateVisit(visit).pipe(retry(2)).subscribe({
      next: visit => {
        this.visitSignal.update(visits =>
          visits.map(c => c.id === visit.id ? visit : c)
        );
        this.loadingSignal.set(false)
      }
    })
  }

  deleteVisit(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dataApi.deleteVisit(id).pipe(retry(2)).subscribe({
      next: () => {
        this.visitSignal.update(visits => visits.filter(c => c.id !== id));
        this.loadingSignal.set(false);
      }
    })
  }

  getServiceById(id: number | null|undefined): Signal<MainService | undefined> {
    return computed(() => id ? this.services().find(c => c.id === id) : undefined);
  }

  private loadVisits(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dataApi.getVisits().pipe(takeUntilDestroyed()).subscribe({
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

  private loadVehicles(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dataApi.getVehicles().pipe(takeUntilDestroyed()).subscribe({
      next: vehicles => {
        this.vehicleSignal.set(vehicles);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load vehicles'));
        this.loadingSignal.set(false);
      }
    });
  }

  private loadServices(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dataApi.getServices().pipe(takeUntilDestroyed()).subscribe({
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

  private loadRepairs(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.dataApi.getRepairs().pipe(takeUntilDestroyed()).subscribe({
      next: repairs => {
        this.repairSignal.set(repairs);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load repairs'));
        this.loadingSignal.set(false);
      }
    });
  }
}
