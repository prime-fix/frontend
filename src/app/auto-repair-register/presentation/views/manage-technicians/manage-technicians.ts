import {Component, computed, inject} from '@angular/core';
import {RegisterStore} from '@register/application/register-store';
import {IamStore} from '@iam/application/iam-store';
import {TechnicianCard} from '@register/presentation/components/technician-card/technician-card';
import {TranslatePipe} from '@ngx-translate/core';
import {Router} from '@angular/router';


@Component({
  selector: 'app-manage-technicians',
  imports: [TechnicianCard, TranslatePipe],
  templateUrl: './manage-technicians.html',
  styleUrls: ['./manage-technicians.css'],
})
export class ManageTechnicians {

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
   * The IAM Store.
   */
  private readonly iamStore = inject(IamStore);

  /**
   * The current session user account.
   */
  private readonly sessionUserAccount = this.iamStore.sessionUserAccount;

  /**
   * The Auto Repair associated with the current session user account.
   */
  readonly autoRepair = computed(() => {
     const userAccount = this.sessionUserAccount();
     if (!userAccount) {
       return undefined;
     }
     const autoRepairs = this.registerStore.autoRepairs();
    return autoRepairs.find(ar => ar.user_account_id === userAccount.id);
   });

  /**
   * The Technicians associated with the current Auto Repair.
   */
   readonly technicians = computed(() => {
     const autoRepair = this.autoRepair();
     if (!autoRepair) {
       return [];
     }
     const allTechnicians = this.registerStore.technicians();
    return allTechnicians.filter(t => t.auto_repair_id === autoRepair.id);
   });

  /**
   * Gets the schedules for a specific technician.
   * @param technicianId - The ID of the technician.
   */
  getTechnicianSchedules(technicianId: number) {
    return computed(() => {
      const allSchedules = this.registerStore.techniciansSchedules();
      return allSchedules.filter(schedule => schedule.technician_id === technicianId);
    });
  }

}
