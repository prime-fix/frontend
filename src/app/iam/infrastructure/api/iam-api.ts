import { Injectable } from '@angular/core';
import {BaseApi} from '@shared/infrastructure/http/base-api';
import {UserAccountsApiEndpoint} from '@iam/infrastructure/api/user-accounts-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserAccount} from '@iam/domain/model/user-account.entity';
import {UserApiEndpoint} from '@iam/infrastructure/api/user-api-endpoint';
import {User} from '@iam/domain/model/user.entity';
import {PaymentApiEndpoint} from '@iam/infrastructure/api/payment-api-endpoint';
import {Payment} from '@iam/domain/model/payment.entity';

/**
 * IAM API service that provides methods to interact with the IAM backend.
 * It uses various API endpoints to perform CRUD operations on user accounts, users, payments, and locations.
 */
@Injectable({
  providedIn: 'root'
})
export class IamApi extends BaseApi {
  /**
   * API endpoints for different IAM resources.
   * @private
   */
  private readonly userAccountsEndpoint:     UserAccountsApiEndpoint;
  /**
   * API endpoint for user-related operations.
   * @private
   */
  private readonly usersEndpoint:            UserApiEndpoint;
  /**
   * API endpoint for payment-related operations.
   * @private
   */
  private readonly paymentsEndpoint:         PaymentApiEndpoint;

  /**
   * Constructor to initialize the IAM API service with the necessary endpoints.
   * @param http - The HttpClient instance for making HTTP requests.
   */
  constructor(http: HttpClient) {
    super();
    this.userAccountsEndpoint = new UserAccountsApiEndpoint(http);
    this.usersEndpoint = new UserApiEndpoint(http);
    this.paymentsEndpoint = new PaymentApiEndpoint(http);
  }

  /**
   * Fetches all user accounts from the backend.
   * @returns An Observable emitting an array of UserAccount entities.
   */
  getUserAccounts(): Observable<UserAccount[]> {
    return this.userAccountsEndpoint.getAll();
  }

  /**
   * Fetches a specific user account by its ID.
   * @param id
   */
  getUserAccount(id: string): Observable<UserAccount> {
    return this.userAccountsEndpoint.getById(id);
  }

  /**
   * Creates a new user account.
   * @param userAccount - The UserAccount entity to be created.
   */
  createUserAccount(userAccount: UserAccount): Observable<UserAccount> {
    return this.userAccountsEndpoint.create(userAccount);
  }

  /**
   * Updates an existing user account.
   * @param userAccount - The UserAccount entity with updated information.
   */
  updateUserAccount(userAccount: UserAccount): Observable<UserAccount> {
    return this.userAccountsEndpoint.update(userAccount, userAccount.id);
  }

  /**
   * Deletes a user account by its ID.
   * @param id - The ID of the user account to be deleted.
   */
  deleteUserAccount(id: string): Observable<void> {
    return this.userAccountsEndpoint.delete(id);
  }

  /**
   * Fetches all users from the backend.
   * @returns An Observable emitting an array of User entities.
   */
  getUsers(): Observable<User[]> {
    return this.usersEndpoint.getAll();
  }

  /**
   * Fetches a specific user by its ID.
   * @param id - The ID of the user to be fetched.
   * @return An Observable emitting the User entity.
   */
  getUser(id: string): Observable<User> {
    return this.usersEndpoint.getById(id);
  }

  /**
   * Creates a new user.
   * @param user - The User entity to be created.
   * @return An Observable emitting the created User entity.
   */
  createUser(user: User): Observable<User> {
    return this.usersEndpoint.create(user);
  }

  /**
   * Updates an existing user.
   * @param user - The User entity with updated information.
   * @return An Observable emitting the updated User entity.
   */
  updateUser(user: User): Observable<User> {
    return this.usersEndpoint.update(user, user.id);
  }

  /**
   * Deletes a user by its ID.
   * @param id - The ID of the user to be deleted.
   * @return An Observable emitting void upon successful deletion.
   */
  deleteUser(id: string): Observable<void> {
    return this.usersEndpoint.delete(id);
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
}
