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

// Interface para visitas agendadas con información completa
interface ScheduledVisitInfo {
  visit: Visit;
  customerName: string;
  vehicleModel: string;
  date: string;
  time: string;
}

// Interface para calificaciones con información completa
interface RatingInfo {
  rating: Rating;
  customerName: string;
  date: string;
}

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

  // Signals
  showDetailsModal = signal(false);
  selectedVisit = signal<ScheduledVisitInfo | null>(null);

  // Get current workshop
  sessionUserAccount = this.iamStore.sessionUserAccount;

  currentAutoRepair = computed(() => {
    const userAccountId = this.sessionUserAccount()?.id;
    if (!userAccountId) return undefined;
    return this.registerStore.autoRepairs().find(ar => ar.id_user_account === userAccountId);
  });

  // TODO: FIX  SCHEDULE VISITS AND RATINGS
  // Get scheduled visits for this workshop
  scheduledVisits = computed<ScheduledVisitInfo[]>(() => {
    const autoRepair = this.currentAutoRepair();
    if (!autoRepair) return [];

    const visits = this.dataCollectionStore.visits();
    const expectedVisits = this.diagnosisStore.expectedVisits();
    const vehicles = this.dataCollectionStore.vehicles();
    const users = this.iamStore.users();

    // Filter visits assigned to this workshop and scheduled
    const workshopVisits = visits.filter(visit => visit.id_auto_repair === autoRepair.id);

    const scheduledVisitsInfo: ScheduledVisitInfo[] = [];

    for (const visit of workshopVisits) {
      const expectedVisit = expectedVisits.find(ev => ev.id_visit === visit.id);
      if (!expectedVisit || !expectedVisit.is_scheduled) continue;

      // Get vehicle to find owner
      const vehicle = vehicles.find(v => v.id === visit.id_vehicle);
      if (!vehicle) continue;

      // Get user (customer) information
      const customer = users.find(u => u.id === vehicle.id_user);
      const customerName = customer?.name || 'Desconocido';

      // Format date and time
      const visitDate = visit.time_visit ? new Date(visit.time_visit) : new Date();
      const date = visitDate.toLocaleDateString('es-ES');
      const time = visitDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

      scheduledVisitsInfo.push({
        visit,
        customerName,
        vehicleModel: vehicle.model,
        date,
        time
      });
    }

    return scheduledVisitsInfo;
  });

  // TODO: FIX RATINGS
  // Get ratings for this workshop
  receivedRatings = computed<RatingInfo[]>(() => {
    const autoRepair = this.currentAutoRepair();
    if (!autoRepair) return [];

    const ratings = this.paymentServiceStore.ratings();
    const users = this.iamStore.users();

    // Filter ratings for this workshop
    const workshopRatings = ratings.filter(rating => rating.id_auto_repair === autoRepair.id);

    const ratingsInfo: RatingInfo[] = [];

    for (const rating of workshopRatings) {
      // Get user (customer) information
      const customer = users.find(u => u.id === rating.id_user_account);
      const customerName = customer?.name || 'Desconocido';

      // For now, we'll use a placeholder date since Rating entity doesn't have a date field
      const date = new Date().toLocaleDateString('es-ES');

      ratingsInfo.push({
        rating,
        customerName,
        date
      });
    }

    return ratingsInfo;
  });

  // Methods
  onShowDetails(visitInfo: ScheduledVisitInfo): void {
    this.selectedVisit.set(visitInfo);
    this.showDetailsModal.set(true);
  }

  onCloseModal(): void {
    this.showDetailsModal.set(false);
    this.selectedVisit.set(null);
  }

  // Helper method to generate star display
  getStars(rating: number): string {
    return '⭐'.repeat(rating);
  }
}
