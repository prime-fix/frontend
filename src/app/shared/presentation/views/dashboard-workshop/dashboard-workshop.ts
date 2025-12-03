import {Component, inject, signal, computed} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {DataCollectionStore} from '@collections/application/data-collection-store';
import {DiagnosisStore} from '@diagnosis/application/diagnosis-store';
import {PaymentServiceStore} from '@payment/application/payment-service-store';
import {IamStore} from '@iam/application/iam-store';
import {Visit} from '@collections/domain/model/visit.entity';
import {ExpectedVisit} from '@diagnosis/domain/model/expected-visit.entity';
import {CatalogStore} from '@catalog/application/catalog-store';
import {TrackingStore} from '@tracking/application/tracking-store';


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
  private catalogStore = inject(CatalogStore);
  private iamStore = inject(IamStore);
  private trackingStore = inject(TrackingStore);

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
    return this.catalogStore.autoRepairs().find(ar => ar.user_account_id === userAccountId);
  });

  /**
   * Get expected visits for the current workshop
   */
  expectedVisitsScheduled = computed(() => {
    const visitsByAutoRepair = this.dataCollectionStore.visits().filter(v => v.auto_repair_id === this.currentAutoRepair()?.id);
    const expectedVisitByVisit = this.diagnosisStore.expectedVisits();

    return expectedVisitByVisit.filter(ev => visitsByAutoRepair.some(v => v.id === ev.visit_id && ev.is_scheduled));
  });

  /**
   * Get ratings received by the current workshop
   */
  receivedRatings = computed(() => {
      return this.paymentServiceStore.ratings().filter(r => r.auto_repair_id === this.currentAutoRepair()?.id);
  });

  /**
   * Get username by user account ID
   * @param id_user_account - The user account ID
   * @return Computed signal with the username
   */
  getUserNameByUserAccountId(id_user_account: number) {
    return computed (() => {
      const userAccount = this.iamStore.userAccounts().find(ua => ua.id === id_user_account);
      return userAccount ? userAccount.username : 'Unknown User';
    })
  }

  /**
   * Get visit by expected visit ID
   * @param expectedVisitId - The expected visit ID
   * @return Computed signal with the visit
   */
  getVisitByExpectedVisitId(expectedVisitId: number) {
    return computed (() => {
      return this.dataCollectionStore.visits().find(v => v.id === this.diagnosisStore.expectedVisits().find(ev => ev.id === expectedVisitId)?.visit_id) || null;
    })
  }

  /**
   * Get user's full name by visit ID
   * @param visitId - The visit ID
   * @return Computed signal with the user's full name
   */
  getUserFullNameByVisitId(visitId: number) {
    return computed(() => {
      const visit = this.dataCollectionStore.visits().find(v => v.id === visitId);
      if (!visit) return 'Unknown User';

      const vehicles = this.trackingStore.vehicles();
      const vehicle = vehicles.find(veh => veh.id === visit.vehicle_id);
      if (!vehicle) return 'Unknown User';

      const user = this.iamStore.users().find(u => u.id === vehicle.user_id);
      return user ? `${user.name} ${user.last_name}` : 'Unknown User';
    });
  }

  /**
   * Get vehicle by vehicle ID
   * @param vehicleId - The vehicle ID
   */
  getVehicleByVehicleId(vehicleId: number) {
    return computed(() => {
      return this.trackingStore.vehicles().find(v => v.id === vehicleId) || null;
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
