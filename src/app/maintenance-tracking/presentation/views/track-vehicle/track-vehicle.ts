import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {ProgressBar} from '@tracking/presentation/components/progress-bar/progress-bar';
import {StateError} from '@tracking/presentation/components/state-error/state-error';
import {TrackingStore} from '@tracking/application/tracking-store';
import {IamStore} from '@iam/application/iam-store';
import {Vehicle} from '@tracking/domain/model/vehicle.entity';
import {ListDiagnostics} from '@tracking/presentation/components/list-diagnostics/list-diagnostics';

@Component({
  selector: 'app-track-vehicle',
  imports: [ReactiveFormsModule, TranslateModule, CommonModule, ProgressBar, StateError, ListDiagnostics],
  templateUrl: './track-vehicle.html',
  styleUrl: './track-vehicle.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrackVehicle {
  private fb = inject(FormBuilder);
  private trackingStore = inject(TrackingStore);
  private iamStore = inject(IamStore);
  private route = inject(ActivatedRoute);

  selectedVehicle = signal<Vehicle | undefined>(undefined);
  showProgressBar = signal<boolean>(false);
  showError = signal<boolean>(false);

  // Vehicles filtered by userId
  vehiclesByUserId = computed(() => {
    const userId = this.iamStore.sessionUserId();
    return userId ? this.trackingStore.vehicles().filter(vehicle => this.iamStore.isCurrentUser(vehicle.user_id)) : [];
  });

  trackForm = this.fb.group({
    selectedVehicleId: new FormControl<number | null>(null, {validators: [Validators.required]})
  });

  constructor() {
    // Handle query parameters from notification navigation
    this.route.queryParams.subscribe(params => {
      const vehicleId = params['vehicleId'];
      if (vehicleId) {
        const vehicleIdNum = Number(vehicleId);
        // Set the form value
        this.trackForm.patchValue({ selectedVehicleId: vehicleIdNum });
        // Automatically trigger the selection
        setTimeout(() => this.onSelect(), 0);
      }
    });
  }

  onSelect() {
    if (this.trackForm.invalid) {
      this.trackForm.markAllAsTouched();
      return;
    }
    const selectedVehicleId = this.trackForm.get('selectedVehicleId')?.value;
    if (!selectedVehicleId) {
      return;
    }

    this.selectedVehicle.set(this.vehiclesByUserId().find(v => v.id === selectedVehicleId));

    if (this.selectedVehicle()) {
      const maintenanceStatus = this.selectedVehicle()?.maintenance_status;
      console.log('🔍 Selected vehicle:', {
        id: this.selectedVehicle()?.id,
        plate: this.selectedVehicle()?.vehicle_plate,
        maintenance_status: maintenanceStatus
      });

      // Show error if maintenance_status is 0 (not being serviced/not accepted)
      if (maintenanceStatus === 0) {
        console.log('⚠️ Vehicle not being serviced (maintenance_status: 0), showing error state');
        this.showError.set(true);
        this.showProgressBar.set(false);
      } else {
        console.log('✅ Vehicle in service (maintenance_status:', maintenanceStatus + '), showing progress');
        this.showError.set(false);
        this.showProgressBar.set(true);
      }
    }
  }
}
