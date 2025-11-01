import {ChangeDetectionStrategy, Component, computed, inject, input, Signal, signal} from '@angular/core';
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
  selectedVisitId = signal<string | null>(null);
  modalLoading = signal(false);

  /**
   * Filtered visits based on current user and maintenance state
   */
  filteredVisits = computed(() => {
    const currentUser = this.iamStore.sessionUser();
    if (!currentUser) {
      console.log('No current user found');
      return [];
    }

    const allVisits = this.dataStore.visits();
    const allVehicles = this.dataStore.vehicles();
    const isScheduled = this.isNewVisits();

    console.log('Computing filteredVisits:', {
      currentUserId: currentUser.id,
      totalVisits: allVisits.length,
      totalVehicles: allVehicles.length,
      isScheduled
    });
    // Create a map of vehicles by id for faster lookup
    const vehicleMap = new Map(allVehicles.map(v => [v.id, v]));

    return allVisits.filter(visit => {
      const vehicle = vehicleMap.get(visit.id_vehicle);

      if (!vehicle) {
        console.log(`Vehicle not found for visit ${visit.id}, id_vehicle: ${visit.id_vehicle}`);
        return false;
      }

      // Filter by user ownership
      if (vehicle.id_user !== currentUser.id) {
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

  countPriceDiagnosticByExpectedVisitId(visitId: string) {
    return computed(() => {
      const expectedVisit = this.diagnosisStore.expectedVisits().find(ev => ev.id_visit === visitId);
      return this.diagnosisStore.diagnostics()
        .filter(diagnostic => diagnostic.id_expected === expectedVisit?.id)
        .map(diagnostic => diagnostic.price)
        .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    });
  }

  /**
   * Open cancel confirmation modal
   * @param visitId - ID of the visit to cancel
   */
  openCancelModal(visitId: string) {
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

    const expectedVisit = this.diagnosisStore.expectedVisits().find(v => v.id_visit === visitId);

    if (!expectedVisit) {
      this.modalLoading.set(false);
      this.closeCancelModal();
      return;
    }

    const updatedExpectedVisit = new ExpectedVisit({
      id_expected: expectedVisit.id,
      state_visit: 'Visit Cancelled',
      id_visit: visitId,
      is_scheduled: false
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
  isVisitCancelled(visitId: string) {
    const expectedVisit = this.diagnosisStore.expectedVisits().find(v => v.id_visit === visitId);
    return expectedVisit?.state_visit === 'Visit Cancelled' && !expectedVisit.is_scheduled;
  }

  /**
   * Get auto repair by ID
   * @param autoRepairID - ID of the auto repair
   */
  getAutoRepair(autoRepairID: string | undefined) {
    return this.dataStore.getAutoRepairById(autoRepairID);
  }

  /**
   * Get user account by ID
   * @param userAccountId - ID of the user account
   */
  getUserAccountById(userAccountId: string | undefined) {
    return this.iamStore.getUserAccountById(userAccountId);
  }

  /**
   * Get user by ID
   * @param userId - ID of the user
   */
  getUserById(userId: string | undefined) {
    return this.iamStore.getUserById(userId);
  }

  /**
   * Get location by ID
   * @param locationId - ID of the location
   */
  getLocationById(locationId: string) {
    return this.iamStore.getLocationById(locationId);
  }

  /** Get address associated with an auto repair
   * @param autoRepairId - ID of the auto repair
   */
  getAddressByAutoRepair(autoRepairId: string | null) {
    return computed(() => {
      const autoRepair = this.getAutoRepair(autoRepairId!)();
      if (!autoRepair) return 'Unkown Location';
      const userAccount = this.getUserAccountById(autoRepair.id_user_account)();
      if (!userAccount) return 'Unkown Location';
      const user = this.getUserById(userAccount.id_user)();
      if (!user) return 'Unkown Location';
      const location = this.getLocationById(user.id_location)();
      return location ? location.address : 'Unkown Location';
    });
  }
}
