import { Injectable, computed, Signal, signal } from '@angular/core';
import { Location } from '../domain/model/location.entity';
import { AutoRepair } from '../domain/model/auto-repair.entity';
import { Technician } from '../domain/model/technician.entity';
import { WorkshopCatalogApi } from '../infrastructure/workshop-catalog-api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkshopCatalogStore {
  private readonly locationsSignal = signal<Location[]>([]);
  private readonly autoRepairsSignal = signal<AutoRepair[]>([]);
  private readonly techniciansSignal = signal<Technician[]>([]);
  readonly locations = this.locationsSignal.asReadonly();
  readonly autoRepairs = this.autoRepairsSignal.asReadonly();
  readonly technicians = this.techniciansSignal.asReadonly();
  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();
  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();
  readonly autoRepairCount = computed(() => this.autoRepairs().length);
  readonly locationCount = computed(() => this.locations().length);

  constructor(private workshopCatalogApi: WorkshopCatalogApi) {
    this.loadLocations();
    this.loadAutoRepairs();
    this.loadTechnicians();
  }

  getAutoRepairsByDistrict(district: string): Signal<AutoRepair[]> {
    return computed(() => {
      const filteredLocations = this.locations().filter(loc => loc.district === district);
      const locationIds = filteredLocations.map(loc => loc.id);
      return this.autoRepairs().filter(repair => locationIds.includes(repair.locationId));
    });
  }

  getLocationById(id: number | null | undefined): Signal<Location | undefined> {
    return computed(() => id ? this.locations().find(loc => loc.id === id) : undefined);
  }

  getAvailableTechniciansByRepair(autoRepairId: number): Signal<Technician[]> {
    return computed(() =>
      this.technicians().filter(tech => tech.autoRepairId === autoRepairId && tech.available)
    );
  }

  getUniqueDistricts(): Signal<string[]> {
    return computed(() => {
      const districts = this.locations().map(loc => loc.district);
      return Array.from(new Set(districts));
    });
  }

  getUniqueDepartments(): Signal<string[]> {
    return computed(() => {
      const departments = this.locations().map(loc => loc.department);
      return Array.from(new Set(departments));
    });
  }

  private loadLocations(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.workshopCatalogApi.getLocations().pipe(takeUntilDestroyed()).subscribe({
      next: locations => {
        this.locationsSignal.set(locations);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load locations'));
        this.loadingSignal.set(false);
      }
    });
  }

  private loadAutoRepairs(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.workshopCatalogApi.getAutoRepairs().pipe(takeUntilDestroyed()).subscribe({
      next: autoRepairs => {
        this.autoRepairsSignal.set(autoRepairs);
        this.loadingSignal.set(false);
        this.assignLocationsToAutoRepairs();
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load auto repairs'));
        this.loadingSignal.set(false);
      }
    });
  }

  private loadTechnicians(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.workshopCatalogApi.getTechnicians().pipe(takeUntilDestroyed()).subscribe({
      next: technicians => {
        this.techniciansSignal.set(technicians);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load technicians'));
        this.loadingSignal.set(false);
      }
    });
  }

  private assignLocationsToAutoRepairs(): void {
    this.autoRepairsSignal.update(autoRepairs =>
      autoRepairs.map(repair => {
        const location = this.locations().find(loc => loc.id === repair.locationId);
        return { ...repair, location: location ?? null } as AutoRepair;
      })
    );
  }

  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }
}
