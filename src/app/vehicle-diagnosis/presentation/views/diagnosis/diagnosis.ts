import {Component, effect, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {StatusVehicleStore} from '../../../../vehicle-status/application/status-vehicle-store';
import {map} from 'rxjs/operators';
import {StatusVehicle} from '../../../../vehicle-status/domain/model/status-vehicle.entity';

@Component({
  selector: 'app-diagnosis',
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    RouterLink
  ],
  templateUrl: './diagnosis.html',
  styleUrl: './diagnosis.css'
})
export class Diagnosis {
  private route = inject(ActivatedRoute);
  private store = inject(StatusVehicleStore);

  private id = toSignal(this.route.paramMap.pipe(map(params => Number(params.get('id')))));
  vehicle = this.store.getStatusVehicleById(this.id());

  selectedStatus = '';
  selectedDiagnosis: string = '';
  selectedPrice: number | null = null;

  options = [
    {value: 'En diagnostico', viewValue: 'En diagnostico'},
    {value: 'Recogido', viewValue: 'Recogido'},
  ];

  constructor() {
    console.log('✅ Diagnosis component loaded correctamente');

    // Sincroniza los valores del formulario con los datos actuales del vehículo
    effect(() => {
      const v = this.vehicle();
      if (v) {
        this.selectedStatus = v.status;
        this.selectedDiagnosis = v.diagnostic;
        this.selectedPrice = v.price;
      }
    });
  }

  updateVehicle(id: number | undefined) {
    if (!id || !this.vehicle()) return;

    // Clonamos el vehículo actual y reemplazamos solo los campos cambiados
    const updatedVehicle: StatusVehicle = new StatusVehicle ({
      id: this.vehicle()?.id ?? 0,
      vehicle: this.vehicle()?.vehicle ?? '',
      license_plate: this.vehicle()?.license_plate ?? '',
      owner: this.vehicle()?.owner ?? '',
      status: (this.selectedStatus || this.vehicle()?.status) ?? '',
      diagnostic: (this.selectedDiagnosis || this.vehicle()?.diagnostic) ?? '',
      price: this.selectedPrice ?? this.vehicle()?.price ?? 0
    });

    this.store.updateStatusVehicle(updatedVehicle);

    alert(`✅ Vehículo ${updatedVehicle.vehicle} actualizado correctamente`);
  }
}
