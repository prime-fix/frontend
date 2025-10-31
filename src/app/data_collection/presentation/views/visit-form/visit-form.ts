import { Component } from '@angular/core';
import {inject} from '@angular/core';
import {FormBuilder,FormControl,ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {DataCollectionStore} from '../../../application/data-collection-store';
import {Visit} from '../../../domain/model/visit.entity';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Location } from '@angular/common';
import {TranslateModule, TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-visit-form',
  imports: [ReactiveFormsModule, MatNativeDateModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatInput, MatDatepickerInput, MatDatepickerToggle, MatDatepicker, TranslatePipe],
  templateUrl: './visit-form.html',
  styleUrl: './visit-form.css'
})
export class VisitForm {
  private fb=inject(FormBuilder);
  private router=inject(Router)
  private route=inject(ActivatedRoute);
  private store=inject(DataCollectionStore);
  private location = inject(Location);

  form = this.fb.group({
    failure: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    id_vehicle: new FormControl<string|null>(null),
    time_visit: new FormControl<string|null>('', { nonNullable: true, validators: [Validators.required] }),
    id_auto_repair: new FormControl<number|string|null>(null),
    id_service: new FormControl<number|string|null>(null),
  });
  visits = this.store.visits;
  visitId: number |string | null = null;
  isEdit = false;
  vehicles = this.store.vehicles;
  services = this.store.services;


  constructor() {
    this.route.params.subscribe(params => {
      this.visitId = params['id'] ?? null;
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
    const formValue = this.form.value;
    if (this.form.invalid) return;
    const visit = new Visit({
      id_visit: this.visitId ?? `V${Date.now()}`,
      failure: formValue.failure ?? '',
      id_vehicle: formValue.id_vehicle ?? '',
      time_visit: formValue.time_visit
        ? new Date(formValue.time_visit).toISOString().split('T')[0]
        : null,
      id_auto_repair: formValue.id_auto_repair ? formValue.id_auto_repair : null,
      id_service: formValue.id_service ?? '',
    });
    console.log('Visit to send:', visit);

    if (this.isEdit) {
      this.store.updateVisit(visit);

    } else {
      this.store.addVisit(visit);
    }

    this.router.navigate(['visits/alert'], { state: { visit } }).then();
  }

  goBack() {
    this.location.back();
  }
}
