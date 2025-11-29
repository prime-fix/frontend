import {Component, inject, signal, computed} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {DataCollectionStore} from '@collections/application/data-collection-store';
import {DiagnosisStore} from '@diagnosis/application/diagnosis-store';
import {IamStore} from '@iam/application/iam-store';
import {RegisterStore} from '@register/application/register-store';
import {Visit} from '@collections/domain/model/visit.entity';
import {ExpectedVisit} from '@diagnosis/domain/model/expected-visit.entity';

@Component({
  selector: 'app-manage-requests',
  imports: [TranslateModule, CommonModule],
  templateUrl: './manage-requests.html',
  styleUrl: './manage-requests.css'
})
export class ManageRequests {
  private dataCollectionStore = inject(DataCollectionStore);
  private diagnosisStore = inject(DiagnosisStore);
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
   * Signal for loading state
   */
  isLoading = signal(false);

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
   * Get pending expected visits for the current workshop
   */
  pendingExpectedVisits = computed(() => {
    const visitsByAutoRepair = this.dataCollectionStore.visits().filter(v => v.id_auto_repair === this.currentAutoRepair()?.id);
    const expectedVisitByVisit = this.diagnosisStore.expectedVisits();

    return expectedVisitByVisit.filter(ev =>
      visitsByAutoRepair.some(v => v.id === ev.id_visit) &&
      !ev.is_scheduled &&
      ev.state_visit === 'Pending Visit'
    );
  });

  /**
   * Get visit by expected visit ID
   * @param id_expected_visit - The expected visit ID
   * @return Computed signal with the visit
   */
  getVisitByExpectedVisitId(id_expected_visit: string) {
    return computed(() => {
      return this.dataCollectionStore.visits().find(v => v.id === this.diagnosisStore.expectedVisits().find(ev => ev.id === id_expected_visit)?.id_visit) || null;
    });
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
   * @param expectedVisit - The expected visit to show details for
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
   * Accept an expected visit request
   */
  onAcceptExpectedVisit(expectedVisit: ExpectedVisit): void {
    const newExpectedVisit = new ExpectedVisit({
      id_expected: expectedVisit.id,
      state_visit: 'Scheduled visit',
      id_visit: expectedVisit.id_visit,
      is_scheduled: true
    });
    this.diagnosisStore.updateExpectedVisit(newExpectedVisit);
  }

  /**
   * Reject an expected visit request
   */
  onRejectExpectedVisit(expectedVisit: ExpectedVisit): void {
    const newExpectedVisit = new ExpectedVisit({
      id_expected: expectedVisit.id,
      state_visit: 'Visit cannot be scheduled',
      id_visit: expectedVisit.id_visit,
      is_scheduled: false
    });
    this.diagnosisStore.updateExpectedVisit(newExpectedVisit);
  }
}
