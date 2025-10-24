import {Component, computed, effect, inject, OnInit, signal} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {RegisterStore} from '@register/application/register-store';
import {Technician} from '@register/domain/model/technician.entity';
import {IamStore} from '@iam/application/iam-store';
import {TechnicianSchedule} from '@register/domain/model/technician-schedule.entity';
import {TranslatePipe} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';

interface ScheduleForm {
  day_of_week: FormControl<string>;
  start_time: FormControl<string>;
  end_time: FormControl<string>;
}

@Component({
  selector: 'app-technician-form',
  imports: [ReactiveFormsModule, TranslatePipe, CommonModule],
  templateUrl: './technician-form.html',
  styleUrls: ['./technician-form.css']
})
export class TechnicianForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private registerStore = inject(RegisterStore);
  private iamStore = inject(IamStore);

  protected isEdit = signal(false);
  protected technicianId = signal<string | null>(null);
  protected currentTechnician = signal<Technician | undefined>(undefined);

  form = this.fb.group({
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    last_name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    schedules: this.fb.array<FormGroup<ScheduleForm>>([])
  });

  protected availableDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  /**
   * Gets the current auto repair from the logged user
   */
  protected autoRepair = computed(() => {
    const userAccount = this.iamStore.sessionUserAccount();
    if (!userAccount) return undefined;

    const autoRepairs = this.registerStore.autoRepairs();
    return autoRepairs.find(ar => ar.id_user_account === userAccount.id);
  });

  /**
   * Gets the schedules FormArray
   */
  get schedules(): FormArray<FormGroup<ScheduleForm>> {
    return this.form.get('schedules') as FormArray<FormGroup<ScheduleForm>>;
  }

  ngOnInit() {
    // Check if we are in edit mode
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEdit.set(true);
        this.technicianId.set(id);
        this.loadTechnicianData(id);
      } else {
        this.isEdit.set(false);
        this.addScheduleRow(); // Add one empty row for new technician
      }
    });
  }

  /**
   * Loads technician data when in edit mode
   */
  private loadTechnicianData(id: string) {
    const technician = this.registerStore.getTechnicianById(id)();

    if (!technician) {
      console.error('Technician not found');
      this.router.navigate(['/layout-workshop/manage-technicians/technicians']);
      return;
    }

    this.currentTechnician.set(technician);

    // Populate form with technician data
    this.form.patchValue({
      name: technician.name,
      last_name: technician.last_name
    });

    // Load technician schedules
    const allSchedules = this.registerStore.techniciansSchedules();
    const technicianSchedules = allSchedules.filter(s => s.id_technician === id && s.is_active);

    // Clear existing schedules
    this.schedules.clear();

    // Add schedules to form
    if (technicianSchedules.length > 0) {
      technicianSchedules.forEach(schedule => {
        this.schedules.push(this.createScheduleFormGroup(schedule));
      });
    } else {
      // Add one empty row if no schedules exist
      this.addScheduleRow();
    }
  }

  /**
   * Creates a schedule form group
   */
  private createScheduleFormGroup(schedule?: TechnicianSchedule): FormGroup<ScheduleForm> {
    return this.fb.group({
      day_of_week: new FormControl<string>(schedule?.day_of_week || 'Monday', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      start_time: new FormControl<string>(schedule?.start_time || '09:00', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      end_time: new FormControl<string>(schedule?.end_time || '17:00', {
        nonNullable: true,
        validators: [Validators.required]
      })
    });
  }

  /**
   * Adds a new schedule row
   */
  addScheduleRow() {
    this.schedules.push(this.createScheduleFormGroup());
  }

  /**
   * Removes a schedule row at the specified index
   */
  removeScheduleRow(index: number) {
    if (this.schedules.length > 1) {
      this.schedules.removeAt(index);
    }
  }

  /**
   * Submits the form
   */
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const autoRepair = this.autoRepair();
    if (!autoRepair) {
      console.error('Auto repair not found');
      return;
    }

    const formValue = this.form.getRawValue();

    if (this.isEdit()) {
      this.updateTechnician(formValue, autoRepair.id);
    } else {
      this.createTechnician(formValue, autoRepair.id);
    }
  }

  /**
   * TODO: FIX THE FUNCTION CREATE TECHNICIAN
   * Creates a new technician
   */
  private createTechnician(formValue: any, autoRepairId: string) {
    // Generate a unique ID for the technician
    const technicianId = `T${Date.now()}`;

    const technician = new Technician({
      id_technician: technicianId,
      name: formValue.name,
      last_name: formValue.last_name,
      id_auto_repair: autoRepairId
    });

    // Add technician to store
    this.registerStore.addTechnician(technician);

    // Add schedules
    formValue.schedules.forEach((schedule: any, index: number) => {
      const technicianSchedule = new TechnicianSchedule({
        id_schedule: `TS${Date.now()}_${index}`,
        id_technician: technicianId,
        day_of_week: schedule.day_of_week,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        is_active: true
      });

      this.registerStore.addTechnicianSchedule(technicianSchedule);
    });

    // Navigate back to manage technicians
    setTimeout(() => {
      this.router.navigate(['/layout-workshop/manage-technicians/technicians']);
    }, 500);
  }

  /**
   * TODO: FIX THE FUNCTION UPDATE TECHNICIAN
   * Updates an existing technician
   */
  private updateTechnician(formValue: any, autoRepairId: string) {
    const technicianId = this.technicianId();
    if (!technicianId) return;

    const technician = new Technician({
      id_technician: technicianId,
      name: formValue.name,
      last_name: formValue.last_name,
      id_auto_repair: autoRepairId
    });

    // Update technician
    this.registerStore.updateTechnician(technician);

    // Get existing schedules for this technician and DELETE them
    const existingSchedules = this.registerStore.techniciansSchedules()
      .filter(s => s.id_technician === technicianId);

    // Delete all existing schedules
    existingSchedules.forEach(schedule => {
      this.registerStore.deleteTechnicianSchedule(schedule.id);
    });

    // Add new schedules from form
    formValue.schedules.forEach((schedule: any, index: number) => {
      const technicianSchedule = new TechnicianSchedule({
        id_schedule: `TS${Date.now()}_${index}`,
        id_technician: technicianId,
        day_of_week: schedule.day_of_week,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        is_active: true
      });

      this.registerStore.addTechnicianSchedule(technicianSchedule);
    });

    // Navigate back to manage technicians
    setTimeout(() => {
      this.router.navigate(['/layout-workshop/manage-technicians/technicians']);
    }, 500);
  }

  /**
   * Cancels the form and navigates back
   */
  onCancel() {
    this.router.navigate(['/layout-workshop/manage-technicians/technicians']);
  }
}
