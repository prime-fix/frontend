import {Component, inject, signal} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import {ProgressBar} from '@tracking/presentation/components/progress-bar/progress-bar';
import {StateError} from '@tracking/presentation/components/state-error/state-error';
import {StateNotification} from '@tracking/presentation/views/state-notification/state-notification';

@Component({
  selector: 'app-track-vehicle',
  imports: [ReactiveFormsModule, TranslateModule, CommonModule, ProgressBar, StateError, StateNotification],
  templateUrl: './track-vehicle.html',
  styleUrl: './track-vehicle.css'
})
export class TrackVehicle {
  private fb = inject(FormBuilder);
  currentVehicle = signal<string | undefined>("");
  selectedVehicleData = signal<any>(null);
  showProgressBar = signal<boolean>(false);
  showError = signal<boolean>(false);
  showNotificationModal = signal<boolean>(false);
  hasNotification = signal<boolean>(true);

  // Vehicle sample data with maintenance status
  vehicles = [
    { id: 'V001', name: 'COMFORTABLE 14', brand: 'Toyota', model: 'Corolla', year: 2020, maintenanceStatus: 0 },
    { id: 'V002', name: 'SPEED DEMON', brand: 'Honda', model: 'Civic', year: 2019, maintenanceStatus: 3 },
    { id: 'V003', name: 'CITY RUNNER', brand: 'Nissan', model: 'Sentra', year: 2021, maintenanceStatus: 5 },
    { id: 'V004', name: 'ZEN 1.0 MT', brand: 'Renault', model: 'Zen', year: 2022, maintenanceStatus: 2 }
  ];

  trackForm = this.fb.group({
    selectedVehicle: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]})
  });

  onSelect() {
    if (this.trackForm.invalid) {
      this.trackForm.markAllAsTouched();
      return;
    }

    const selectedVehicleId = this.trackForm.get('selectedVehicle')?.value;
    const selectedVehicle = this.vehicles.find(v => v.id === selectedVehicleId);

    if (selectedVehicle) {
      this.currentVehicle.set(selectedVehicle.name);
      this.selectedVehicleData.set(selectedVehicle);

      // Show error if maintenance status is 0 (not being repaired)
      if (selectedVehicle.maintenanceStatus === 0) {
        this.showError.set(true);
        this.showProgressBar.set(false);
      } else {
        this.showError.set(false);
        this.showProgressBar.set(true);
      }
    }

    console.log('Vehicle selected for tracking:', selectedVehicle);
  }

  openNotificationModal() {
    this.showNotificationModal.set(true);
  }

  closeNotificationModal() {
    this.showNotificationModal.set(false);
    this.hasNotification.set(false);
  }
}
