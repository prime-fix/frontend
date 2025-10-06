import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {StatusVehicleStore} from '../../../../vehicle-status/application/status-vehicle-store';
import {map} from 'rxjs/operators';
import {NgIf} from '@angular/common';
import {StatusVehicle} from '../../../../vehicle-status/domain/model/status-vehicle.entity';

@Component({
  selector: 'app-diagnosis',
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    NgIf,
    RouterLink,
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

  updateVehicle() {
    const currentVehicle = this.vehicle();

    if (!currentVehicle) return;

    const updatedVehicle = {
      ...currentVehicle, // <-- mantiene todas las propiedades originales
      _diagnostic: this.selectedDiagnosis,
      _price: this.selectedPrice,
      _status: this.selectedStatus
    };

    this.store.updateStatusVehicle(updatedVehicle);
  }


}
