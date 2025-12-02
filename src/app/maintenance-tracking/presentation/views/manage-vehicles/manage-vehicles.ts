import {Component, computed, inject, signal} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {TrackingStore} from '@tracking/application/tracking-store';
import {Vehicle} from '@tracking/domain/model/vehicle.entity';
import {IamStore} from '@iam/application/iam-store';

@Component({
  selector: 'app-manage-vehicles',
  imports: [ReactiveFormsModule, TranslateModule, CommonModule],
  templateUrl: './manage-vehicles.html',
  styleUrl: './manage-vehicles.css'
})
export class ManageVehicles {
  private fb = inject(FormBuilder);
  private trackingStore = inject(TrackingStore);
  private iamStore = inject(IamStore);

  // Signals
  showModal = signal(false);
  isEditMode = signal(false);
  selectedVehicleId = signal<number | null>(null);
  vehiclesByUserId = computed(() => {
    const userId = this.iamStore.sessionUserId();
    return userId ? this.trackingStore.vehicles().filter(vehicle => this.iamStore.isCurrentUser(vehicle.user_id)) : [];
  })

  // Form
  vehicleForm = this.fb.group({
    model: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    brand: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    plate: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    color: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    type: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
  });

  // Methods
  onAddVehicle(): void {
    this.isEditMode.set(false);
    this.selectedVehicleId.set(null);
    this.vehicleForm.reset();
    this.showModal.set(true);
  }

  onEditVehicle(vehicle: Vehicle): void {
    this.isEditMode.set(true);
    this.selectedVehicleId.set(vehicle.id);
    this.vehicleForm.patchValue({
      model: vehicle.model,
      brand: vehicle.vehicle_brand,
      type: vehicle.vehicle_type,
      plate: vehicle.vehicle_plate,
      color: vehicle.color
    });
    this.showModal.set(true);
  }

  onDeleteVehicle(vehicleId: number): void {
    this.trackingStore.deleteVehicle(vehicleId);
  }

  onCloseModal(): void {
    this.showModal.set(false);
    this.vehicleForm.reset();
    this.selectedVehicleId.set(null);
  }

  onSubmit(): void {
    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      return;
    }

    const formData = this.vehicleForm.getRawValue();
    const userId = this.iamStore.sessionUserId() || 0;

    if (this.isEditMode()) {
      // Update existing vehicle
      const vehicleId = this.selectedVehicleId();
      if (vehicleId) {
        const updatedVehicle = new Vehicle({
          id: vehicleId,
          model: formData.model,
          vehicle_plate: formData.plate,
          color: formData.color,
          user_id: userId,
          vehicle_brand: formData.brand,
          vehicle_type: formData.type,
          state_maintenance: 0
        });
        this.trackingStore.updateVehicle(updatedVehicle);
      }
    } else {
      // Create new vehicle
      const newVehicle = new Vehicle({
        id: 0, // ID will be assigned by backend
        model: formData.model,
        vehicle_plate: formData.plate,
        color: formData.color,
        user_id: userId,
        vehicle_brand: formData.brand,
        vehicle_type: formData.type,
        state_maintenance: 0
      });
      this.trackingStore.addVehicle(newVehicle);
    }

    this.onCloseModal();
  }

  generateVehicleId(): string {
    return `RV${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }
}
