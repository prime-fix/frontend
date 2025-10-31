import {Component, inject, signal, computed} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {DataCollectionStore} from '@collections/application/data-collection-store';
import {DiagnosisStore} from '@diagnosis/application/diagnosis-store';
import {PaymentServiceStore} from '@payment/application/payment-service-store';
import {IamStore} from '@iam/application/iam-store';
import {RegisterStore} from '@register/application/register-store';
import {Visit} from '@collections/domain/model/visit.entity';
import {Rating} from '@payment/domain/model/rating.entity';
import {ExpectedVisit} from '@diagnosis/domain/model/expected-visit.entity';


@Component({
  selector: 'app-dashboard-workshop',
  imports: [TranslateModule, CommonModule],
  templateUrl: './dashboard-workshop.html',
  styleUrl: './dashboard-workshop.css'
})
export class DashboardWorkshop {
  private dataCollectionStore = inject(DataCollectionStore);
  private diagnosisStore = inject(DiagnosisStore);
  private paymentServiceStore = inject(PaymentServiceStore);
  private iamStore = inject(IamStore);
  private registerStore = inject(RegisterStore);

  /**
   * Signal to control the visibility of the details modal
   */
  showDetailsModal = signal(false);

  /**
   * Signal to hold the selected expected visit and its associated visit
   */
  selectedExpectedVisitAndVisit = signal<{ expectedVisit: ExpectedVisit; visit: Visit | null } | null>(null);

  /**
   * Get the current session user account
   */
  sessionUserAccount = this.iamStore.sessionUserAccount;

  /**
   * Get the current auto repair (workshop) based on the session user account
   */
  currentAutoRepair = computed(() => {
    const userAccountId = this.sessionUserAccount()?.id;
    if (!userAccountId) return undefined;
    return this.registerStore.autoRepairs().find(ar => ar.id_user_account === userAccountId);
  });

  /**
   * Get expected visits for the current workshop
   */
  expectedVisits = computed(() => {
    const visitsByAutoRepair = this.dataCollectionStore.visits().filter(v => v.id_auto_repair === this.currentAutoRepair()?.id);
    const expectedVisitByVisit = this.diagnosisStore.expectedVisits();

    return expectedVisitByVisit.filter(ev => visitsByAutoRepair.some(v => v.id === ev.id_visit));
  });

  /**
   * Get ratings received by the current workshop
   */
  receivedRatings = computed(() => {
      return this.paymentServiceStore.ratings().filter(r => r.id_auto_repair === this.currentAutoRepair()?.id);
  });

  /**
   * Get username by user account ID
   * @param id_user_account - The user account ID
   * @return Computed signal with the username
   */
  getUserNameByUserAccountId(id_user_account: string) {
    return computed (() => {
      const userAccount = this.iamStore.userAccounts().find(ua => ua.id === id_user_account);
      return userAccount ? userAccount.username : 'Unknown User';
    })
  }

  /**
   * Get visit by expected visit ID
   * @param id_expected_visit - The expected visit ID
   * @return Computed signal with the visit
   */
  getVisitByExpectedVisitId(id_expected_visit: string) {
    return computed (() => {
      return this.dataCollectionStore.visits().find(v => v.id === this.diagnosisStore.expectedVisits().find(ev => ev.id === id_expected_visit)?.id_visit) || null;
    })
  }

  /**
   * Get user's full name by visit ID
   * @param id_visit - The visit ID
   * @return Computed signal with the user's full name
   */
  getUserFullNameByVisitId(id_visit: string) {
    return computed(() => {
      const visit = this.dataCollectionStore.visits().find(v => v.id === id_visit);
      if (!visit) return 'Unknown User';

      const vehicles = this.dataCollectionStore.vehicles();
      const vehicle = vehicles.find(veh => veh.id === visit.id_vehicle);
      if (!vehicle) return 'Unknown User';

      const user = this.iamStore.users().find(u => u.id === vehicle.id_user);
      return user ? `${user.name} ${user.last_name}` : 'Unknown User';
    });
  }

  /**
   * Get vehicle by vehicle ID
   * @param id_vehicle - The vehicle ID
   */
  getVehicleByVehicleId(id_vehicle: string) {
    return computed(() => {
      return this.dataCollectionStore.vehicles().find(v => v.id === id_vehicle) || null;
    });
  }

  /**
   * Show details modal for a specific visit
   * @param expectedVisit - The visit to show details for
   * @param visit - The associated visit
   */
  onShowDetails(expectedVisit: ExpectedVisit, visit: Visit): void {
    this.selectedExpectedVisitAndVisit.set({ expectedVisit, visit });
    this.showDetailsModal.set(true);
  }

  /**
   * Close the details modal
   */
  onCloseModal(): void {
    this.showDetailsModal.set(false);
    this.selectedExpectedVisitAndVisit.set(null);
  }

  /**
   * Get star representation for a rating
   * @param rating - The rating value
   */
  getStars(rating: number): string {
    return '⭐'.repeat(rating);
  }
}
