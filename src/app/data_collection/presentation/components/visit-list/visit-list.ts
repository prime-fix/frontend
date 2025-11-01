import {Component, input, computed, ChangeDetectionStrategy} from '@angular/core';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {IamStore} from '@iam/application/iam-store';
import {DataCollectionStore} from '@collections/application/data-collection-store';


@Component({
  selector: 'app-visit-list',
  imports: [TranslatePipe],
  templateUrl: './visit-list.html',
  styleUrl: './visit-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisitList {
  readonly dataStore = inject(DataCollectionStore);
  readonly iamStore = inject(IamStore);
  readonly router = inject(Router);

  /**
   * Input to determine if showing scheduled visits (true) or history (false)
   * true = scheduled visits (state_maintenance < 6)
   * false = history (state_maintenance === 6)
   */
  isNewVisits = input.required<boolean>();

  /**
   * Filtered visits based on isNewVisits input and current user's vehicles
   */
  filteredVisits = computed(() => {
    const currentUser = this.iamStore.sessionUserAccount();
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

    // TODO: Optimize by creating a map of vehicles by id
    // Create a map of vehicles by id for faster lookup
    const vehicleMap = new Map(allVehicles.map(v => [v.id, v]));

    const filtered = allVisits.filter(visit => {
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

    console.log('Filtered visits result:', filtered.length, filtered);
    return filtered;
  });

  /**
   * Cancel a scheduled visit
   */
  cancelVisit(id: string) {
    if (confirm('¿Está seguro que desea cancelar esta visita?')) {
      this.dataStore.deleteVisit(id);
    }
  }


  getAutoRepair(autoRepairID: string | undefined) {
    return this.dataStore.getAutoRepairById(autoRepairID);
  }

  getUserAccountById(userAccountId: string | undefined) {
    return this.iamStore.getUserAccountById(userAccountId);
  }

  getUserById(userId: string | undefined) {
    return this.iamStore.getUserById(userId);
  }

  getLocationById(locationId: string) {
    return this.iamStore.getLocationById(locationId);
  }

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
