import {Component, computed, inject, OnInit, Signal, signal} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {RegisterStore} from '@register/application/register-store';
import {Technician} from '@register/domain/model/technician.entity';
import {IamStore} from '@iam/application/iam-store';
import {TechnicianSchedule} from '@register/domain/model/technician-schedule.entity';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {CatalogStore} from '@catalog/application/catalog-store';

interface ScheduleForm {
  id_schedule: FormControl<number | null>;
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
  private catalogStore = inject(CatalogStore);
  private translate = inject(TranslateService);

  /**
   * Indicates if we are in edit mode
   * @protected
   */
  protected isEdit = signal(false);
  /**
   * The technician ID being edited
   * @protected
   */
  protected technicianId = signal<number | null>(null);
  /**
   * The current technician being edited
   * @protected
   */
  protected currentTechnician = signal<Technician | undefined>(undefined);

  /**
   * Current language signal
   * @protected
   */
  protected currentLang = signal<string>('en');

  /**
   * Days translation map
   */
  private daysMap: Record<string, string> = this.buildDaysMap();

  /**
   * The technician form group
   */
  form = this.fb.group({
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    last_name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    schedules: this.fb.array<FormGroup<ScheduleForm>>([])
  });

  /**
   * Available days of the week
   * @protected
   */
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
   * Days order for sorting schedules chronologically.
   * @private
   */
  private readonly daysOrder: Record<string, number> = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7
  };

  /**
   * Gets the current auto repair from the logged user
   */
  protected autoRepair = computed(() => {
    const userAccount = this.iamStore.sessionUserAccount();
    if (!userAccount) return undefined;

    const autoRepairs = this.catalogStore.autoRepairs();
    return autoRepairs.find(ar => ar.user_account_id === userAccount.id);
  });

  /**
   * Gets the schedules FormArray
   */
  get schedules(): FormArray<FormGroup<ScheduleForm>> {
    return this.form.get('schedules') as FormArray<FormGroup<ScheduleForm>>;
  }

  /**
   * Component initialization
   */
  ngOnInit(): void {
    // initialize language and days map
    this.currentLang.set(this.translate.getCurrentLang());
    this.daysMap = this.buildDaysMap();

    // react to language changes
    this.translate.onLangChange.subscribe((e) => {
      this.currentLang.set(e.lang);
      this.daysMap = this.buildDaysMap();
    });

    // Check if we are in edit mode
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        const parsedId = Number(idParam);
        if (!isNaN(parsedId)) {
          this.isEdit.set(true);
          this.technicianId.set(parsedId);
          this.loadTechnicianData(parsedId);
        } else {
          this.isEdit.set(false);
          this.addScheduleRow();
        }
      } else {
        this.isEdit.set(false);
        this.addScheduleRow(); // Add one empty row for new technician
      }
    });
  }

  /**
   * Builds a translation map for days of week using TranslateService
   */
  private buildDaysMap(): Record<string, string> {
    return {
      Monday: this.translate.instant('manage-technicians.technician-card.monday'),
      Tuesday: this.translate.instant('manage-technicians.technician-card.tuesday'),
      Wednesday: this.translate.instant('manage-technicians.technician-card.wednesday'),
      Thursday: this.translate.instant('manage-technicians.technician-card.thursday'),
      Friday: this.translate.instant('manage-technicians.technician-card.friday'),
      Saturday: this.translate.instant('manage-technicians.technician-card.saturday'),
      Sunday: this.translate.instant('manage-technicians.technician-card.sunday'),
    };
  }

  /**
   * Returns a computed signal with the translated day (falls back to the original)
   */
  translateDay(day: string): Signal<string> {
    return computed(() => {
      if (this.currentLang() === 'es') {
        return this.daysMap[day] ?? day;
      }
      return day;
    });
  }

  /**
   * Loads technician data when in edit mode
   */
  private loadTechnicianData(id: number) {
    const technician = this.registerStore.getTechnicianById(id)();

    if (!technician) {
      console.error('Technician not found');
      this.router.navigate(['/layout-workshop/auto-repair-register/technicians']).then();
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
    const technicianSchedules = allSchedules.filter(s => s.technician_id === id && s.is_active);

    // Sort schedules chronologically
    const sortedSchedules = technicianSchedules.sort((a, b) => {
      const orderA = this.daysOrder[a.day_of_week] ?? 999;
      const orderB = this.daysOrder[b.day_of_week] ?? 999;
      return orderA - orderB;
    });

    // Clear existing schedules
    this.schedules.clear();

    // Add schedules to form
    if (sortedSchedules.length > 0) {
      sortedSchedules.forEach(schedule => {
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
      id_schedule: new FormControl<number | null>(schedule?.id || null),
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
   * Creates a new technician and associated schedules
   * @param formValue - The form values
   * @param autoRepairId - The auto repair ID
   * @private
   * @returns void
   */
  private createTechnician(formValue: any, autoRepairId: number) {

    const technician = new Technician({
      id: 0, // assuming ID will be set by backend
      name: formValue.name,
      last_name: formValue.last_name,
      auto_repair_id: autoRepairId
    });

    // Add technician to store
    this.registerStore.addTechnician(technician);

    // Add schedules
    formValue.schedules.forEach((schedule: any) => {
      const technicianSchedule = new TechnicianSchedule({
        id: 0, // assuming ID will be set by backend
        technician_id: technician.id,
        day_of_week: schedule.day_of_week,
        start_time: schedule.start_time,
        end_time: schedule.end_time,
        is_active: true
      });

      this.registerStore.addTechnicianSchedule(technicianSchedule);
    });

    // Navigate back to manage technicians
    setTimeout(() => {
      this.router.navigate(['/layout-workshop/auto-repair-register/technicians']).then();
    }, 500);
  }

  /**
   * Updates an existing technician and associated schedules
   * @param formValue - The form values
   * @param autoRepairId - The auto repair ID
   * @private
   * @returns void
   */
  private updateTechnician(formValue: any, autoRepairId: number) {
    const technicianId = this.technicianId();
    if (!technicianId) return;

    // Update technician basic info
    const technician = new Technician({
      id: technicianId,
      name: formValue.name,
      last_name: formValue.last_name,
      auto_repair_id: autoRepairId
    });

    this.registerStore.updateTechnician(technician);

    // Get existing schedules from the store
    const existingSchedules = this.registerStore.techniciansSchedules()
      .filter(s => s.technician_id === technicianId);

    // Get schedules from form
    const formSchedules = formValue.schedules;

    // Identify schedules to delete (exist in DB but not in form)
    const schedulesToDelete = existingSchedules.filter(existing =>
      !formSchedules.some((form: any) => form.id_schedule === existing.id)
    );

    // Identify schedules to update (have id_schedule and exist in both)
    const schedulesToUpdate = formSchedules.filter((form: any) =>
      form.id_schedule && existingSchedules.some(existing => existing.id === form.id_schedule)
    );

    // Identify schedules to add (don't have id_schedule)
    const schedulesToAdd = formSchedules.filter((form: any) => !form.id_schedule);

    // Execute deletions
    schedulesToDelete.forEach(schedule => {
      this.registerStore.deleteTechnicianSchedule(schedule.id);
    });

    // Execute updates
    schedulesToUpdate.forEach((scheduleForm: any) => {
      const updatedSchedule = new TechnicianSchedule({
        id: scheduleForm.id_schedule,
        technician_id: technicianId,
        day_of_week: scheduleForm.day_of_week,
        start_time: scheduleForm.start_time,
        end_time: scheduleForm.end_time,
        is_active: true
      });
      this.registerStore.updateTechnicianSchedule(updatedSchedule);
    });

    // Execute additions
    schedulesToAdd.forEach((scheduleForm: any) => {
      const newSchedule = new TechnicianSchedule({
        id: 0, // assuming ID will be set by backend
        technician_id: technicianId,
        day_of_week: scheduleForm.day_of_week,
        start_time: scheduleForm.start_time,
        end_time: scheduleForm.end_time,
        is_active: true
      });
      this.registerStore.addTechnicianSchedule(newSchedule);
    });

    // Navigate back to manage technicians
    setTimeout(() => {
      this.router.navigate(['/layout-workshop/auto-repair-register/technicians']);
    }, 500);
  }

  /**
   * Cancels the form and navigates back
   */
  onCancel() {
    this.router.navigate(['/layout-workshop/auto-repair-register/technicians']);
  }
}
