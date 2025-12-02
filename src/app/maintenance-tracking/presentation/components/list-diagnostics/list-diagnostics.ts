import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {Vehicle} from '@tracking/domain/model/vehicle.entity';
import {DiagnosisStore} from '@diagnosis/application/diagnosis-store';

@Component({
  selector: 'app-list-diagnostics',
  imports: [TranslateModule, CommonModule],
  templateUrl: './list-diagnostics.html',
  styleUrl: './list-diagnostics.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListDiagnostics {
  private diagnosisStore = inject(DiagnosisStore);

  // Input to receive the selected vehicle from parent component
  currentVehicle = input<Vehicle | undefined>();

  // Computed signal to get diagnostics filtered by vehicle and sorted by price (most expensive first)
  diagnosticsByVehicle = computed(() => {
    const vehicle = this.currentVehicle();
    if (!vehicle) {
      return [];
    }

    return this.diagnosisStore.diagnostics()
      .filter(diagnostic => diagnostic.vehicle_id === vehicle.id)
      .sort((a, b) => b.price - a.price); // Sort from most expensive to cheapest
  });

  // Computed signal to get the total price of all diagnostics
  totalPrice = computed(() => {
    return this.diagnosticsByVehicle().reduce((sum, diagnostic) => sum + diagnostic.price, 0);
  });
}


