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

  /**
   * Update days map on language change.
   */
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

  /**
   * The Translation Service.
   * @private
   */
  private translate = inject(TranslateService);

  /**
   * The current language.
   * @protected
   */
  protected currentLang = signal<string>('en');

  /**
   * Days map for translation.
   * @private
   */
  private daysMap = this.buildDaysMap();

  /**
   * The current Technician.
   */
  technician = input.required<Technician>();

  /**
   * The current Technician Schedules.
   */
  technicianSchedules = input.required<TechnicianSchedule[]>()

  /**
   * Sets up the Technician Card component.
   */
  constructor() {
    this.currentLang.set(this.translate.getCurrentLang());
  }

  /**
   * Builds the days map for translation.
   * @private
   * @return The days map.
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
   * Translates a day of the week.
   * @param day - The day to translate.
   * @return The translated day.
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
   * Navigates to edit technician page.
   * @param id - The technician ID.
   * @return void.
   */
  editTechnician(id: string) {
    this.router.navigate(['layout-workshop/manage-technicians/technicians/edit', id]).then();
  }

  /**
   * Navigates to delete technician page.
   * @param id - The technician ID.
   * @return void.
   */
  deleteTechnician(id: string) {
    this.registerStore.deleteTechnician(id);
  }
}
