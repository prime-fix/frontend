import {computed, inject, Injectable, Signal, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {retry} from 'rxjs';
import {Payment} from '../domain/model/payment.entity';
import {Rating} from '../domain/model/rating.entity';
import {PaymentServiceApi} from '../infrastructure/payment-service-api';
import {DataCollectionStore} from '@collections/application/data-collection-store';
import {Visit} from '@collections/domain/model/visit.entity';
import {Vehicle} from '@collections/domain/model/vehicle.entity';

/**
 * State management service for Payment Service
 */
@Injectable({
  providedIn: 'root'
})
export class PaymentServiceStore {
  /**
   * DataCollectionStore instance for managing related data.
   * @private
   */
  private readonly dataCollectionStore = inject(DataCollectionStore);
  /**
   * Signal to hold the state of payments.
   * @private
   */
  private readonly paymentsSignal = signal<Payment[]>([]);
  /**
   * Signal to hold the state of rating.
   * @private
   */
  private readonly ratingsSignal = signal<Rating[]>([]);

  /**
   * Readonly versions of the state signals for external access.
   */
  readonly payments = this.paymentsSignal.asReadonly();
  /**
   * Readonly versions of the state signals for external access.
   */
  readonly visits = this.dataCollectionStore.visits;
  /**
   * Readonly versions of the state signals for external access.
   */
  readonly vehicles = this.dataCollectionStore.vehicles;
  /**
   * Readonly versions of the state signals for external access.
   */
  readonly ratings = this.ratingsSignal.asReadonly();

  /**
   * Signal to track loading state.
   * @private
   */
  private readonly loadingSignal = signal<boolean>(false);
  /**
   * Readonly version of loading signal.
   */
  readonly loading = this.loadingSignal.asReadonly();
  /**
   * Signal to track error messages.
   * @private
   */
  private readonly errorSignal = signal<string | null>(null);
  /**
   * Readonly version of error signal.
   */
  readonly error = this.errorSignal.asReadonly();

  /**
   * Computed property to get the count of payments.
   */
  readonly paymentCount = computed(() => this.payments().length);
  /**
   * Computed property to get the count of visits.
   */
  readonly visitCount = computed(() => this.dataCollectionStore.visitCount());
  /**
   * Computed property to get the count of vehicles.
   */
  readonly vehicleCount = computed(() => this.dataCollectionStore.vehicleCount());
  /**
   * Computed property to get the count of ratings.
   */
  readonly ratingCount = computed(() => this.ratings().length);


  constructor(private paymentServiceClosureApi: PaymentServiceApi) {
    this.loadPayments();
    this.loadRatings();
  }

  loadPaymentsByUserAccountId(userAccountId: string | number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.paymentServiceClosureApi.getPayments().pipe(takeUntilDestroyed()).subscribe({
      next: payments => {
        console.log(payments);
        const filteredPayments = payments.filter(
          payment => payment.id_user_account === userAccountId
        );
        this.paymentsSignal.set(filteredPayments);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load payments'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Gets a payment by their ID.
   * @param id - The ID of the payment to retrieve.
   * @return A signal containing the payment or undefined if not found.
   */
  getPaymentById(id: string | null | undefined): Signal<Payment | undefined> {
    return computed(() => id ? this.payments().find(p => p.id === id) : undefined);
  }

  /**
   * Gets a payment by its ID.
   * @param payment - The ID of the payment to retrieve.
   */
  addPayment(payment: Payment): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.paymentServiceClosureApi.createPayment(payment).pipe(retry(2)).subscribe({
      next: createdPayment => {
        this.paymentsSignal.set([...this.payments(), createdPayment]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create payment'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Updates an existing payment.
   * @param updatedPayment - The payment with updated information.
   */
  updatePayment(updatedPayment: Payment): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.paymentServiceClosureApi.updatePayment(updatedPayment).pipe(retry(2)).subscribe({
      next: payment => {
        this.paymentsSignal.update(payments =>
          payments.map(p => p.id === payment.id ? payment : p))
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update payment'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Deletes a payment by ID.
   * @param id - The ID of the payment to delete.
   */
  deletePayment(id: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.paymentServiceClosureApi.deletePayment(id).pipe(retry(2)).subscribe({
      next: () => {
        this.paymentsSignal.update(payments => payments.filter(p => p.id !== id))
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete payment'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Loads payments from the API and updates the state signal.
   * @private - This method is intended for internal use only.
   */
  private loadPayments(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.paymentServiceClosureApi.getPayments().pipe(takeUntilDestroyed()).subscribe({
      next: payments => {
        console.log(payments);
        this.paymentsSignal.set(payments);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load payments'));
        this.loadingSignal.set(false);
      }
    })
  }


   /**
   * Gets a rating by their ID.
   * @param id - The ID of the rating to retrieve.
   * @return A signal containing the rating or undefined if not found.
   */
  getRatingById(id: string | null | undefined): Signal<Rating | undefined> {
    return computed(() => id ? this.ratings().find(r => r.id === id) : undefined);
  }

  /**
   * Gets a rating by its ID.
   * @param rating - The ID of the rating to retrieve.
   */
  addRating(rating: Rating): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.paymentServiceClosureApi.createRating(rating).pipe(retry(2)).subscribe({
      next: createdRating => {
        this.ratingsSignal.set([...this.ratings(), createdRating]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create rating'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Updates an existing rating.
   * @param updatedRating - The payment with updated information.
   */
  updateRating(updatedRating: Rating): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.paymentServiceClosureApi.updateRating(updatedRating).pipe(retry(2)).subscribe({
      next: rating => {
        this.ratingsSignal.update(ratings =>
          ratings.map(r => r.id === rating.id ? rating : r))
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update rating'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Deletes a rating by ID.
   * @param id - The ID of the rating to delete.
   */
  deleteRating(id: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.paymentServiceClosureApi.deleteRating(id).pipe(retry(2)).subscribe({
      next: () => {
        this.ratingsSignal.update(ratings => ratings.filter(r => r.id !== id))
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete rating'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Loads ratings from the API and updates the state signal.
   * @private - This method is intended for internal use only.
   */
  private loadRatings(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.paymentServiceClosureApi.getRatings().pipe(takeUntilDestroyed()).subscribe({
      next: ratings => {
        console.log(ratings);
        this.ratingsSignal.set(ratings);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load ratings'));
        this.loadingSignal.set(false);
      }
    })
  }


  /**
   * Gets a visit by their ID.
   * @param id - The ID of the visit to retrieve.
   * @return A signal containing the payment or undefined if not found.
   */
  getVisitById(id: string | null | undefined): Signal<Visit | undefined> {
    // Delegate to DataCollectionStore
    return this.dataCollectionStore.getVisitById(id);
  }

  /**
   * Gets a vehicle by their ID.
   * @param id - The ID of the vehicle to retrieve.
   * @return A signal containing the payment or undefined if not found.
   */
  getVehicleById(id: string | null | undefined): Signal<Vehicle | undefined> {
    // Delegate to DataCollectionStore
    return this.dataCollectionStore.getVehicleById(id);
  }

  /**
   * Formats error messages for user-friendly display.
   * @param error - The error object.
   * @param fallback - The fallback error message.
   * @returns A formatted error message.
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  }

}
