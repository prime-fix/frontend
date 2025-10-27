import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {CatalogStore} from '@catalog/application/catalog-store';
import {TrackingStore} from '@tracking/application/tracking-store';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {IamStore} from '@iam/application/iam-store';

@Component({
  selector: 'app-schedule-visit',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './schedule-visit.html',
  styleUrl: './schedule-visit.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleVisit {
  private readonly fb = inject(FormBuilder);
  private readonly trackingStore = inject(TrackingStore);
  private readonly catalogStore = inject(CatalogStore);
  private readonly iamStore = inject(IamStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly submitting = signal(false);
  readonly autoRepairId = signal<string | null>(null);

  // Get the auto repair from route params
  readonly autoRepair = computed(() => {
    const id = this.autoRepairId();
    return id ? this.catalogStore.getAutoRepairById(id)() : undefined;
  });

  // Get vehicles for the current user
  readonly userVehicles = computed(() => {
    const userId = this.iamStore.sessionUser()?.id;
    return userId ? this.trackingStore.vehicles().filter(v => v.id_user === userId) : [];
  });

  readonly scheduleForm = this.fb.group({
    vehicleId: ['', Validators.required],
    issues: ['', Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required]
  });

  constructor() {
    // Get auto repair ID from route params
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.autoRepairId.set(id);
    });

    // Watch vehicle selection to autofill car model
    this.scheduleForm.get('vehicleId')?.valueChanges.subscribe(vehicleId => {
      if (vehicleId) {
        const vehicle = this.userVehicles().find(v => v.id === vehicleId);
      }
    });
  }

  onSubmit(): void {
    if (this.scheduleForm.invalid) {
      this.scheduleForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const formData = this.scheduleForm.value;
    console.log('Scheduling visit:', {
      autoRepairId: this.autoRepairId(),
      ...formData
    });

    // TODO: Call API to create the expected visit
    // For now, simulate success
    setTimeout(() => {
      this.submitting.set(false);
      alert('¡Visita agendada exitosamente!');
      void this.router.navigate(['layout-owner/auto-repair-catalog/search-auto-repair']);
    }, 1000);
  }
}
