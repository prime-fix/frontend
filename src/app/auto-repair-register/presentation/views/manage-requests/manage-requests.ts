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
    return this.registerStore.autoRepairs().find(ar => ar.user_account_id === userAccountId);
  });

  /**
   * Get pending expected visits for the current workshop
   * Filters by PENDING_VISIT state and not scheduled
   */
  pendingExpectedVisits = computed(() => {
    const visitsByAutoRepair = this.dataCollectionStore.visits().filter(v => v.auto_repair_id === this.currentAutoRepair()?.id);
    const expectedVisitByVisit = this.diagnosisStore.expectedVisits();

    return expectedVisitByVisit.filter(ev =>
      visitsByAutoRepair.some(v => v.id === ev.visit_id) &&
      !ev.is_scheduled &&
      ev.state_visit === 'PENDING_VISIT' // Matches backend enum default value
    );
  });

  /**
   * Get visit by expected visit ID
   * @param expected_visit_id - The expected visit ID
   * @return Computed signal with the visit
   */
  getVisitByExpectedVisitId(expected_visit_id: number) {
    return computed(() => {
      return this.dataCollectionStore.visits().find(v => v.id === this.diagnosisStore.expectedVisits().find(ev => ev.id === expected_visit_id)?.visit_id) || null;
    });
  }

  /**
   * Get user's full name by visit ID
   * @param visit_id - The visit ID
   * @return Computed signal with the user's full name
   */
  getUserFullNameByVisitId(visit_id: number) {
    return computed(() => {
      const visit = this.dataCollectionStore.visits().find(v => v.id === visit_id);
      if (!visit) return 'Unknown User';

      const vehicles = this.dataCollectionStore.vehicles();
      const vehicle = vehicles.find(veh => veh.id === visit.vehicle_id);
      if (!vehicle) return 'Unknown User';

      const user = this.iamStore.users().find(u => u.id === vehicle.user_id);
      return user ? `${user.name} ${user.last_name}` : 'Unknown User';
    });
  }

  /**
   * Get vehicle by vehicle ID
   * @param vehicle_id - The vehicle ID
   */
  getVehicleByVehicleId(vehicle_id: number) {
    return computed(() => {
      return this.dataCollectionStore.vehicles().find(v => v.id === vehicle_id) || null;
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
   * Changes state_visit from PENDING_VISIT to SCHEDULED_VISIT
   */
  onAcceptExpectedVisit(expectedVisit: ExpectedVisit): void {
    console.log('✅ Accepting expected visit:', expectedVisit.id);
    const newExpectedVisit = new ExpectedVisit({
      id: expectedVisit.id,
      state_visit: 'SCHEDULED_VISIT', // Matches backend enum
      visit_id: expectedVisit.visit_id,
      is_scheduled: true,
      vehicle_id: expectedVisit.vehicle_id
    });
    this.diagnosisStore.updateExpectedVisit(newExpectedVisit);
    this.onCloseModal(); // Close modal after accepting
  }

  /**
   * Reject an expected visit request
   * Changes state_visit from PENDING_VISIT to CANCELLED_VISIT
   */
  onRejectExpectedVisit(expectedVisit: ExpectedVisit): void {
    console.log('❌ Rejecting expected visit:', expectedVisit.id);
    const newExpectedVisit = new ExpectedVisit({
      id: expectedVisit.id,
      state_visit: 'CANCELLED_VISIT', // Matches backend enum
      visit_id: expectedVisit.visit_id,
      is_scheduled: false,
      vehicle_id: expectedVisit.vehicle_id
    });
    this.diagnosisStore.updateExpectedVisit(newExpectedVisit);
    this.onCloseModal(); // Close modal after rejecting
  }
}
