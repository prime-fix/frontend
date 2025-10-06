import { Component } from '@angular/core';
import {inject} from '@angular/core';
import {FormBuilder,FormControl,ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {DataCollection} from '../../../application/data-collection';
import {Visit} from '../../../domain/model/visit.entity';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-visit-form',
  imports: [ReactiveFormsModule, MatNativeDateModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatInput, MatDatepickerInput, MatDatepickerToggle, MatDatepicker],
  templateUrl: './visit-form.html',
  styleUrl: './visit-form.css'
})
export class VisitForm {
  private fb=inject(FormBuilder);
  private router=inject(Router)
  private route=inject(ActivatedRoute);
  private store=inject(DataCollection);

  form = this.fb.group({
    failure: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    id_vehicle: new FormControl<number|string|null>(null),
    time_visit: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    id_auto_repair: new FormControl<number|string|null>(null),
    id_service: new FormControl<number|string|null>(null),
    status: new FormControl<string>('Pendiente', { nonNullable: true, validators: [Validators.required] }),
  });
  visits = this.store.visits;
  visitId: number | null = null;
  isEdit = false;
  vehicles = this.store.vehicles;
  services = this.store.services;

  constructor() {
    this.route.params.subscribe(params => {
      this.visitId = params['id'] ? +params['id'] : null;
      this.isEdit = !!this.visitId;

      if (this.isEdit) {
        const visit = this.store.visits().find(v => v.id === this.visitId);
        if (visit) {
          this.form.patchValue({
            failure: visit.failure,
            id_vehicle: visit.id_vehicle,
            time_visit: visit.time_visit,
            id_auto_repair: visit.id_auto_repair,
            id_service: visit.id_service,
            status: visit.status
          });
        }
      }
    });

    this.route.queryParams.subscribe(params => {
      const repairId = params['id_auto_repair'];
      if (repairId && !this.isEdit) {
        this.form.patchValue({ id_auto_repair: repairId });
      }
    });
  }

  submit() {
    console.log('Form values:', this.form.value);
    if (this.form.invalid) return;
    const visit = new Visit({
      id: this.visitId ?? 0,
      failure: this.form.value.failure!,
      id_vehicle: Number(this.form.value.id_vehicle),
      time_visit: this.form.value.time_visit!,
      id_auto_repair: Number(this.form.value.id_auto_repair),
      id_service: Number(this.form.value.id_service),
      status: this.form.value.status!
    });

    if (this.isEdit) {
      this.store.updateVisit(visit);
    } else {
      this.store.addVisit(visit);
    }

    this.router.navigate(['visits']).then();
  }

  goBack() {
    this.router.navigate(['auto_repair']).then();
  }
}
