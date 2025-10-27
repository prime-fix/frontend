import {ChangeDetectionStrategy, Component, inject, signal, computed} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

interface VehicleData {
  vehicleId: string;
  vehicleBrand: string;
  vehicleModel: string;
  visitId: string;
  ownerName: string;
  currentState: number;
  diagnosis: string;
  price: number;
}

@Component({
  selector: 'app-modify-diagnosis',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modify-diagnosis.html',
  styleUrl: './modify-diagnosis.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModifyDiagnosis {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly vehicleId = signal<string | null>(null);
  readonly loading = signal(false);

  // TODO: Replace with real data from DiagnosisStore
  readonly sampleVehicles: VehicleData[] = [
    {
      vehicleId: 'V001',
      vehicleBrand: 'Toyota',
      vehicleModel: 'Corolla',
      visitId: 'EV001',
      ownerName: 'Luis Navarro',
      currentState: 2,
      diagnosis: 'Falla en el motor de arranque',
      price: 350
    },
    {
      vehicleId: 'V002',
      vehicleBrand: 'Honda',
      vehicleModel: 'Civic',
      visitId: 'EV002',
      ownerName: 'Antonio Valenzuela',
      currentState: 6,
      diagnosis: 'Cambio de aceite y filtros',
      price: 120
    },
    {
      vehicleId: 'V003',
      vehicleBrand: 'Toyota',
      vehicleModel: 'Rav4',
      visitId: 'EV003',
      ownerName: 'John Smith',
      currentState: 3,
      diagnosis: 'Reparación de frenos delanteros',
      price: 280
    }
  ];

  readonly maintenanceStates = [
    { value: 1, label: 'En espera' },
    { value: 2, label: 'En diagnóstico' },
    { value: 3, label: 'En reparación' },
    { value: 4, label: 'En prueba' },
    { value: 5, label: 'Listo para recoger' },
    { value: 6, label: 'Recogido' }
  ];

  readonly vehicleData = computed(() => {
    const id = this.vehicleId();
    return id ? this.sampleVehicles.find(v => v.vehicleId === id) : undefined;
  });

  readonly modifyForm = this.fb.group({
    state: [1, Validators.required],
    diagnosis: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]]
  });

  constructor() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.vehicleId.set(id);

      if (id) {
        const vehicle = this.sampleVehicles.find(v => v.vehicleId === id);
        if (vehicle) {
          this.modifyForm.patchValue({
            state: vehicle.currentState,
            diagnosis: vehicle.diagnosis,
            price: vehicle.price
          });
        }
      }
    });
  }

  onSubmit(): void {
    if (this.modifyForm.invalid) {
      this.modifyForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    // TODO: Replace with actual API call
    // this.diagnosisStore.updateDiagnosis(vehicleId, formData);

    setTimeout(() => {
      this.loading.set(false);
      alert('Diagnóstico modificado correctamente');
      void this.router.navigate(['/workshop/diagnosis']);
    }, 500);
  }

  onCancel(): void {
    void this.router.navigate(['/workshop/diagnosis']);
  }
}
