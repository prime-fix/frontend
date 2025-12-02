import {ChangeDetectionStrategy, Component, computed, inject, input, signal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {IamStore} from '@iam/application/iam-store';
import {DataCollectionStore} from '@collections/application/data-collection-store';
import {DiagnosisStore} from '@diagnosis/application/diagnosis-store';
import {ExpectedVisit} from '@diagnosis/domain/model/expected-visit.entity';


@Component({
  selector: 'app-visit-list',
  imports: [TranslatePipe],
  templateUrl: './visit-list.html',
  styleUrl: './visit-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisitList {
  readonly dataStore = inject(DataCollectionStore);
  private readonly diagnosisStore = inject(DiagnosisStore);
  private readonly iamStore = inject(IamStore);

  /**
   * Input to determine if showing scheduled visits (true) or history (false)
   * true = scheduled visits (state_maintenance < 6)
   * false = history (state_maintenance === 6)
   */
  isNewVisits = input.required<boolean>();

  // Modal state
  isCancelModalOpen = signal(false);
  selectedVisitId = signal<number | null>(null);
  modalLoading = signal(false);

  /**
   * Filtered visits based on current user and maintenance state
   */
  filteredVisits = computed(() => {
    const currentUserId = this.iamStore.sessionUserId();
    if (!currentUserId) {
      console.log('No current user ID found');
      return [];
    }

    const allVisits = this.dataStore.visits();
    const allVehicles = this.dataStore.vehicles();
    const isScheduled = this.isNewVisits();

    // Create a map of vehicles by id for faster lookup
    const vehicleMap = new Map(allVehicles.map(v => [v.id, v]));
    return allVisits.filter(visit => {
      const vehicle = vehicleMap.get(visit.vehicle_id);

      if (!vehicle) {
        return false;
      }

      // Filter by user ownership using IamStore helper method
      if (!this.iamStore.isCurrentUser(vehicle.user_id)) {
        return false;
      }

      // Filter by maintenance state
      if (isScheduled) {
        // Scheduled visits: state_maintenance < 6 (before collected)
        return vehicle.state_maintenance < 6;
      } else {
        // History: state_maintenance === 6 (collected)
        return vehicle.state_maintenance === 6;
      }
    });
  });

  countPriceDiagnosticByExpectedVisitId(visitId: number) {
    return computed(() => {
      const expectedVisit = this.diagnosisStore.expectedVisits().find(ev => ev.visit_id === visitId);
      if (!expectedVisit) return 0;

      return this.diagnosisStore.diagnostics()
        .filter(diagnostic => diagnostic.vehicle_id === expectedVisit.vehicle_id)
        .map(diagnostic => diagnostic.price)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    });
  }

  /**
   * Open cancel confirmation modal
   * @param visitId - ID of the visit to cancel
   */
  openCancelModal(visitId: number) {
    this.selectedVisitId.set(visitId);
    this.isCancelModalOpen.set(true);
  }

  /**
   * Close cancel confirmation modal
   */
  closeCancelModal() {
    if (this.modalLoading()) return;
    this.isCancelModalOpen.set(false);
    this.selectedVisitId.set(null);
  }

  /**
   * Confirm and execute visit cancellation
   */
  confirmCancelVisit() {
    const visitId = this.selectedVisitId();
    if (!visitId) return;

    this.modalLoading.set(true);

    const expectedVisit = this.diagnosisStore.expectedVisits().find(v => v.visit_id === visitId);

    if (!expectedVisit) {
      this.modalLoading.set(false);
      this.closeCancelModal();
      return;
    }

    const updatedExpectedVisit = new ExpectedVisit({
      id: expectedVisit.id,
      state_visit: 'Visit Cancelled',
      visit_id: visitId,
      is_scheduled: false,
      vehicle_id: expectedVisit.vehicle_id
    });

    this.diagnosisStore.updateExpectedVisit(updatedExpectedVisit);

    // Simulate async operation
    setTimeout(() => {
      this.modalLoading.set(false);
      this.closeCancelModal();
    }, 500);
  }

  /**
   * Check if a visit is cancelled
   * @param visitId - ID of the visit
   */
  isVisitCancelled(visitId: number) {
    const expectedVisit = this.diagnosisStore.expectedVisits().find(v => v.visit_id === visitId);
    return expectedVisit?.state_visit === 'Visit Cancelled' && !expectedVisit.is_scheduled;
  }

  /**
   * Get auto repair by ID
   * @param autoRepairID - ID of the auto repair
   */
  getAutoRepair(autoRepairID: number | undefined) {
    return this.dataStore.getAutoRepairById(autoRepairID);
  }

  /**
   * Get user account by ID
   * @param userAccountId - ID of the user account
   */
  getUserAccountById(userAccountId: number | undefined) {
    return this.iamStore.getUserAccountById(userAccountId);
  }

  /**
   * Get user by ID
   * @param userId - ID of the user
   */
  getUserById(userId: number | undefined) {
    return this.iamStore.getUserById(userId);
  }

  /**
   * Get location by ID
   * @param locationId - ID of the location
   */
  getLocationById(locationId: number) {
    return this.iamStore.getLocationById(locationId);
  }

  /** Get address associated with an auto repair
   * @param autoRepairId - ID of the auto repair
   */
  getAddressByAutoRepair(autoRepairId: number | null) {
    return computed(() => {
      const autoRepair = this.getAutoRepair(autoRepairId!)();
      if (!autoRepair) return 'Unkown Location';
      const userAccount = this.getUserAccountById(autoRepair.user_account_id)();
      if (!userAccount) return 'Unkown Location';
      const user = this.getUserById(userAccount.user_id)();
      if (!user) return 'Unkown Location';
      const location = this.getLocationById(user.location_id)();
      return location ? location.address : 'Unkown Location';
    });
  }
}
