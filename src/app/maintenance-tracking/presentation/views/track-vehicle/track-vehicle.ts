import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {ProgressBar} from '@tracking/presentation/components/progress-bar/progress-bar';
import {StateError} from '@tracking/presentation/components/state-error/state-error';
import {StateNotification} from '@tracking/presentation/views/state-notification/state-notification';
import {TrackingStore} from '@tracking/application/tracking-store';
import {IamStore} from '@iam/application/iam-store';

@Component({
  selector: 'app-track-vehicle',
  imports: [ReactiveFormsModule, TranslateModule, CommonModule, ProgressBar, StateError, StateNotification],
  templateUrl: './track-vehicle.html',
  styleUrl: './track-vehicle.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrackVehicle {
  private fb = inject(FormBuilder);
  private trackingStore = inject(TrackingStore);
  private iamStore = inject(IamStore);

  currentVehicle = signal<string | undefined>("");
  selectedVehicleData = signal<any>(null);
  showProgressBar = signal<boolean>(false);
  showError = signal<boolean>(false);
  showNotificationModal = signal<boolean>(false);
  hasNotification = signal<boolean>(true);


  // Vehicles filtered by userId
  vehiclesByUserId = computed(() => {
    const userId = this.iamStore.sessionUser()?.id;
    return userId ? this.trackingStore.vehicles().filter(vehicle => vehicle.id_user === userId) : [];
  });

  trackForm = this.fb.group({
    selectedVehicle: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]})
  });

  onSelect() {
    if (this.trackForm.invalid) {
      this.trackForm.markAllAsTouched();
      return;
    }

    const selectedVehicleId = this.trackForm.get('selectedVehicle')?.value;
    const selectedVehicle = this.vehiclesByUserId().find(v => v.id === selectedVehicleId);

    if (selectedVehicle) {
      this.currentVehicle.set(`${selectedVehicle.vehicle_brand} [${selectedVehicle.vehicle_plate}]`);
      this.selectedVehicleData.set(selectedVehicle.state_maintenance);

      // Show error if maintenance status is 0 (not being repaired)
      if (selectedVehicle.state_maintenance === 0) {
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
