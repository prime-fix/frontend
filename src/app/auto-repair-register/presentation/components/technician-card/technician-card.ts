import {Component, computed, inject, input, OnInit, Signal, signal,} from '@angular/core';
import {Technician} from '@register/domain/model/technician.entity';
import {TechnicianSchedule} from '@register/domain/model/technician-schedule.entity';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {RegisterStore} from '@register/application/register-store';

@Component({
  selector: 'app-technician-card',
  imports: [
    TranslatePipe
  ],
  templateUrl: './technician-card.html',
  styleUrls: ['./technician-card.css']
})
export class TechnicianCard implements OnInit {

  ngOnInit() {
    this.translate.onLangChange.subscribe((e) => {
      this.currentLang.set(e.lang);
      this.daysMap = this.buildDaysMap();
    });
  }

  /**
   * The Router.
   * @protected
   */
  protected router = inject(Router);

  /**
   * The Register Store.
   */
  private readonly registerStore = inject(RegisterStore);

  private translate = inject(TranslateService);
  protected currentLang = signal<string>('en');
  private daysMap = this.buildDaysMap();

  technician = input.required<Technician>();
  technicianSchedules = input.required<TechnicianSchedule[]>()

  constructor() {
    this.currentLang.set(this.translate.getCurrentLang());
  }

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

  translateDay(day: string): Signal<string> {
    return computed(() => {
      if (this.currentLang() === 'es') {
        return this.daysMap[day] ?? day;
      }
      return day;
    });
  }

  editTechnician(id: string) {
    this.router.navigate(['layout-workshop/manage-technicians/technicians/edit', id]).then();
  }

  deleteTechnician(id: string) {
    this.registerStore.deleteTechnician(id);
  }
}
