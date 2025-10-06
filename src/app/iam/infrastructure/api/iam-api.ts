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
import {Location} from '@iam/domain/model/location.entity';
import {LocationApiEndpoint} from '@iam/infrastructure/api/location-api-endpoint';

@Injectable({
  providedIn: 'root'
})
export class IamApi extends BaseApi {
  private readonly userAccountsEndpoint:     UserAccountsApiEndpoint;
  private readonly usersEndpoint:            UserApiEndpoint;
  private readonly paymentsEndpoint:         PaymentApiEndpoint;
  private readonly locationsEndpoint:        LocationApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.userAccountsEndpoint = new UserAccountsApiEndpoint(http);
    this.usersEndpoint = new UserApiEndpoint(http);
    this.paymentsEndpoint = new PaymentApiEndpoint(http);
    this.locationsEndpoint = new LocationApiEndpoint(http);
  }

  getUserAccounts(): Observable<UserAccount[]> {
    return this.userAccountsEndpoint.getAll();
  }

  getUserAccount(id: string): Observable<UserAccount> {
    return this.userAccountsEndpoint.getById(id);
  }

  createUserAccount(userAccount: UserAccount): Observable<UserAccount> {
    return this.userAccountsEndpoint.create(userAccount);
  }

  updateUserAccount(userAccount: UserAccount): Observable<UserAccount> {
    return this.userAccountsEndpoint.update(userAccount, userAccount.id);
  }

  deleteUserAccount(id: string): Observable<void> {
    return this.userAccountsEndpoint.delete(id);
  }

  getUsers(): Observable<User[]> {
    return this.usersEndpoint.getAll();
  }

  getUser(id: string): Observable<User> {
    return this.usersEndpoint.getById(id);
  }

  createUser(user: User): Observable<User> {
    return this.usersEndpoint.create(user);
  }

  updateUser(user: User): Observable<User> {
    return this.usersEndpoint.update(user, user.id);
  }

  deleteUser(id: string): Observable<void> {
    return this.usersEndpoint.delete(id);
  }

  getPayments(): Observable<Payment[]> {
    return this.paymentsEndpoint.getAll();
  }

  getPayment(id: string): Observable<Payment> {
    return this.paymentsEndpoint.getById(id);
  }

  createPayment(payment: Payment): Observable<Payment> {
    return this.paymentsEndpoint.create(payment);
  }

  updatePayment(payment: Payment): Observable<Payment> {
    return this.paymentsEndpoint.update(payment, payment.id);
  }

  deletePayment(id: string): Observable<void> {
    return this.paymentsEndpoint.delete(id);
  }

  getLocations(): Observable<Location[]> {
    return this.locationsEndpoint.getAll();
  }

  getLocation(id: string): Observable<Location> {
    return this.locationsEndpoint.getById(id);
  }

  createLocation(location: Location): Observable<Location> {
    return this.locationsEndpoint.create(location);
  }

  updateLocation(location: Location): Observable<Location> {
    return this.locationsEndpoint.update(location, location.id);
  }

  deleteLocation(id: string): Observable<void> {
    return this.locationsEndpoint.delete(id);
  }

}
