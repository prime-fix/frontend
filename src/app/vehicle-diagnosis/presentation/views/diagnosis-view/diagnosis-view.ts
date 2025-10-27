import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';

interface VehicleWithVisit {
  vehicleId: string;
  vehicleBrand: string;
  vehicleModel: string;
  visitId: string;
  ownerName: string;
  currentState: number;
}

@Component({
  selector: 'app-diagnosis',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './diagnosis-view.html',
  styleUrl: './diagnosis-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiagnosisView {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  // Estado de mantenimiento disponibles
  readonly maintenanceStates = [
    { value: 1, label: 'En espera' },
    { value: 2, label: 'En diagnóstico' },
    { value: 3, label: 'En reparación' },
    { value: 4, label: 'En prueba' },
    { value: 5, label: 'Listo para recoger' },
    { value: 6, label: 'Recogido' }
  ];

  // TODO: Replace with real data from stores (DiagnosisStore, IamStore, TrackingStore)
  // TODO: Implement proper relationship: Vehicle → Diagnostic → ExpectedVisit → User
  readonly vehiclesInMaintenance = signal<VehicleWithVisit[]>([
    {
      vehicleId: 'V001',
      vehicleBrand: 'Toyota',
      vehicleModel: 'Corolla',
      visitId: 'EV001',
      ownerName: 'Luis Navarro',
      currentState: 2
    },
    {
      vehicleId: 'V002',
      vehicleBrand: 'Honda',
      vehicleModel: 'Civic',
      visitId: 'EV002',
      ownerName: 'Antonio Valenzuela',
      currentState: 6
    },
    {
      vehicleId: 'V003',
      vehicleBrand: 'Toyota',
      vehicleModel: 'Rav4',
      visitId: 'EV003',
      ownerName: 'John Smith',
      currentState: 3
    }
  ]);

  // Formularios para cada vehículo
  readonly vehicleForms = signal<Map<string, FormGroup>>(new Map());

  constructor() {
    // Inicializar todos los formularios al inicio con los valores correctos
    this.initializeForms();
  }

  private initializeForms(): void {
    const newMap = new Map<string, FormGroup>();

    for (const vehicle of this.vehiclesInMaintenance()) {
      const form = this.fb.group({
        state: [vehicle.currentState, Validators.required]
      });
      newMap.set(vehicle.vehicleId, form);
    }

    this.vehicleForms.set(newMap);
  }

  getFormForVehicle(vehicleId: string): FormGroup {
    const form = this.vehicleForms().get(vehicleId);

    if (!form) {
      console.error(`Form not found for vehicle ${vehicleId}`);
      // Crear formulario de emergencia si no existe
      const vehicle = this.vehiclesInMaintenance().find(v => v.vehicleId === vehicleId);
      return this.fb.group({
        state: [vehicle?.currentState || 1, Validators.required]
      });
    }

    return form;
  }

  updateVehicleState(vehicleId: string): void {
    const form = this.getFormForVehicle(vehicleId);

    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    // Navigate to modify-diagnosis view with vehicle ID
    void this.router.navigate(['layout-workshop/vehicle-diagnosis/modify-diagnosis/edit', vehicleId]);
  }

  getStateName(stateValue: number): string {
    return this.maintenanceStates.find(s => s.value === stateValue)?.label || 'Desconocido';
  }
}
