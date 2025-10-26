import {Injectable} from '@angular/core';
import {BaseApi} from '@shared/infrastructure/http/base-api';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PaymentApiEndpoint} from './payment-api-endpoint';
import {RatingApiEndpoint} from './rating-api-endpoint';
import {Payment} from '../domain/model/payment.entity';
import {Rating} from '../domain/model/rating.entity';

/**
 * payment-service API service that provides methods to interact with the payment-service backend.
 * It uses various API endpoints to perform CRUD operations on ratings and payments.
 */
@Injectable({
  providedIn: 'root'
})
export class PaymentServiceApi extends BaseApi{
  /**
   * API endpoints for different payment-related operations.
   * @private
   */
  private readonly paymentsEndpoint:     PaymentApiEndpoint;
  /**
   * API endpoints for different rating-related operations.
   * @private
   */
  private readonly ratingsEndpoint:     RatingApiEndpoint;

  /**
   * Constructor to initialize the payment-service API service with the necessary endpoints.
   * @param http - The HttpClient instance for making HTTP requests.
   */
  constructor(http:HttpClient) {
    super();
    this.paymentsEndpoint = new PaymentApiEndpoint(http);
    this.ratingsEndpoint = new RatingApiEndpoint(http);
  }

  /**
   * Fetches all payments from the backend.
   * @returns An Observable emitting an array of Payment entities.
   */
  getPayments(): Observable<Payment[]> {
    return this.paymentsEndpoint.getAll();
  }

  /**
   * Fetches a specific payment by its ID.
   * @param id - The ID of the payment to be fetched.
   * @return An Observable emitting the Payment entity.
   */
  getPayment(id: string): Observable<Payment> {
    return this.paymentsEndpoint.getById(id);
  }

  /**
   * Creates a new payment.
   * @param payment - The Payment entity to be created.
   * @return An Observable emitting the created Payment entity.
   */
  createPayment(payment: Payment): Observable<Payment> {
    return this.paymentsEndpoint.create(payment);
  }

  /**
   * Updates an existing payment.
   * @param payment - The Payment entity with updated information.
   * @return An Observable emitting the updated Payment entity.
   */
  updatePayment(payment: Payment): Observable<Payment> {
    return this.paymentsEndpoint.update(payment, payment.id);
  }

  /**
   * Deletes a payment by its ID.
   * @param id - The ID of the payment to be deleted.
   * @return An Observable emitting void upon successful deletion.
   */
  deletePayment(id: string): Observable<void> {
    return this.paymentsEndpoint.delete(id);
  }

  /**
   * Fetches all ratings from the backend.
   * @returns An Observable emitting an array of Rating entities.
   */
  getRatings(): Observable<Rating[]> {
    return this.ratingsEndpoint.getAll();
  }

  /**
   * Fetches a specific rating by its ID.
   * @param id - The ID of the rating to be fetched.
   * @return An Observable emitting the Rating entity.
   */
  getRating(id: string): Observable<Rating> {
    return this.ratingsEndpoint.getById(id);
  }

  /**
   * Creates a new rating.
   * @param rating - The Rating entity to be created.
   * @return An Observable emitting the created Rating entity.
   */
  createRating(rating: Rating): Observable<Rating> {
    return this.ratingsEndpoint.create(rating);
  }

  /**
   * Updates an existing rating.
   * @param rating - The Rating entity with updated information.
   * @return An Observable emitting the updated Rating entity.
   */
  updateRating(rating: Rating): Observable<Rating> {
    return this.ratingsEndpoint.update(rating, rating.id);
  }

  /**
   * Deletes a rating by its ID.
   * @param id - The ID of the rating to be deleted.
   * @return An Observable emitting void upon successful deletion.
   */
  deleteRating(id: string): Observable<void> {
    return this.ratingsEndpoint.delete(id);
  }
}
