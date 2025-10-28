import {Component, inject, signal, computed} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {DataCollectionStore} from '@collections/application/data-collection-store';
import {DiagnosisStore} from '@diagnosis/application/diagnosis-store';
import {IamStore} from '@iam/application/iam-store';
import {Visit} from '@collections/domain/model/visit.entity';
import {ExpectedVisit} from '@diagnosis/domain/model/expected-visit.entity';

// Interface para combinar Visit + ExpectedVisit
interface Request {
  visit: Visit;
  expectedVisit: ExpectedVisit;
  customerName: string;
  date: string;
  time: string;
}

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

  // Signals
  isLoading = signal(false);

  // Get current workshop
  sessionUserAccount = this.iamStore.sessionUserAccount;

  currentAutoRepair = computed(() => {
    const userAccountId = this.sessionUserAccount()?.id;
    if (!userAccountId) return undefined;
    return this.dataCollectionStore.autoRepairs().find(ar => ar.id_user_account === userAccountId);
  });

  // TODO: FIX PENDING REQUESTS LOGIC
  // Get all pending requests for this workshop
  pendingRequests = computed<Request[]>(() => {
    const autoRepair = this.currentAutoRepair();
    if (!autoRepair) return [];

    const visits = this.dataCollectionStore.visits();
    const expectedVisits = this.diagnosisStore.expectedVisits();
    const users = this.iamStore.users();

    // Filter visits that don't have auto_repair assigned yet (pending requests)
    const pendingVisits = visits.filter(visit => visit.id_auto_repair === null);

    // Map visits with their expected visit and customer info
    const requests: Request[] = [];

    for (const visit of pendingVisits) {
      const expectedVisit = expectedVisits.find(ev => ev.id_visit === visit.id);
      if (!expectedVisit || expectedVisit.is_scheduled) continue; // Skip if already scheduled

      // Get vehicle to find owner
      const vehicle = this.dataCollectionStore.vehicles().find(v => v.id === visit.id_vehicle);
      if (!vehicle) continue;

      // Get user (customer) information
      const customer = users.find(u => u.id === vehicle.id_user);
      const customerName = customer?.name || 'Desconocido';

      // Format date and time
      const visitDate = visit.time_visit ? new Date(visit.time_visit) : new Date();
      const date = visitDate.toLocaleDateString('es-ES');
      const time = visitDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

      requests.push({
        visit,
        expectedVisit,
        customerName,
        date,
        time
      });
    }

    return requests;
  });

  // Methods
  onAcceptRequest(request: Request): void {
    if (!confirm('¿Está seguro de aceptar esta solicitud?')) {
      return;
    }

    this.isLoading.set(true);
    const autoRepair = this.currentAutoRepair();

    if (!autoRepair) {
      console.error('No auto repair found');
      this.isLoading.set(false);
      return;
    }

    // Update Visit with auto_repair_id
    const updatedVisit = new Visit({
      id_visit: request.visit.id,
      failure: request.visit.failure,
      id_vehicle: request.visit.id_vehicle,
      time_visit: request.visit.time_visit,
      id_auto_repair: autoRepair.id,
      id_service: request.visit.id_service
    });
    this.dataCollectionStore.updateVisit(updatedVisit);

    // Update ExpectedVisit to mark as scheduled
    const updatedExpectedVisit = new ExpectedVisit({
      id_expected: request.expectedVisit.id,
      state_visit: 'accepted',
      id_visit: request.expectedVisit.id_visit,
      is_scheduled: true
    });
    this.diagnosisStore.updateExpectedVisit(updatedExpectedVisit);

    setTimeout(() => {
      this.isLoading.set(false);
      alert('Solicitud aceptada exitosamente');
    }, 500);
  }

  onRejectRequest(request: Request): void {
    if (!confirm('¿Está seguro de rechazar esta solicitud?')) {
      return;
    }

    this.isLoading.set(true);

    // Update ExpectedVisit state to rejected
    const updatedExpectedVisit = new ExpectedVisit({
      id_expected: request.expectedVisit.id,
      state_visit: 'rejected',
      id_visit: request.expectedVisit.id_visit,
      is_scheduled: false
    });
    this.diagnosisStore.updateExpectedVisit(updatedExpectedVisit);

    setTimeout(() => {
      this.isLoading.set(false);
      alert('Solicitud rechazada exitosamente');
    }, 500);
  }
}
