import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {ProgressBar} from '@tracking/presentation/components/progress-bar/progress-bar';
import {StateError} from '@tracking/presentation/components/state-error/state-error';
import {StateNotification} from '@tracking/presentation/views/state-notification/state-notification';
import {TrackingStore} from '@tracking/application/tracking-store';
import {IamStore} from '@iam/application/iam-store';
import {Vehicle} from '@tracking/domain/model/vehicle.entity';
import {ListDiagnostics} from '@tracking/presentation/components/list-diagnostics/list-diagnostics';

@Component({
  selector: 'app-track-vehicle',
  imports: [ReactiveFormsModule, TranslateModule, CommonModule, ProgressBar, StateError, StateNotification, ListDiagnostics],
  templateUrl: './track-vehicle.html',
  styleUrl: './track-vehicle.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TrackVehicle {
  private fb = inject(FormBuilder);
  private trackingStore = inject(TrackingStore);
  private iamStore = inject(IamStore);

  selectedVehicle = signal<Vehicle | undefined>(undefined);
  showProgressBar = signal<boolean>(false);
  showError = signal<boolean>(false);
  showNotificationModal = signal<boolean>(false);
  hasNotification = signal<boolean>(true);

  // Vehicles filtered by userId
  vehiclesByUserId = computed(() => {
    const userId = this.iamStore.sessionUserId();
    return userId ? this.trackingStore.vehicles().filter(vehicle => this.iamStore.isCurrentUser(vehicle.user_id)) : [];
  });

  trackForm = this.fb.group({
    selectedVehicleId: new FormControl<number | null>(null, {validators: [Validators.required]})
  });

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
      // Show error if maintenance status is 0 (not being repaired)
      if (this.selectedVehicle()?.state_maintenance === 0) {
        this.showError.set(true);
        this.showProgressBar.set(false);
      } else {
        this.showError.set(false);
        this.showProgressBar.set(true);
      }
    }
  }

  openNotificationModal() {
    this.showNotificationModal.set(true);
  }

  closeNotificationModal() {
    this.showNotificationModal.set(false);
    this.hasNotification.set(false);
  }
}
