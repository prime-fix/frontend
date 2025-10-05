import { Injectable } from '@angular/core';
import {BaseApi} from '@shared/infrastructure/http/base-api';
import {UserAccountsApiEndpoint} from '@iam/infrastructure/api/user-accounts-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserAccount} from '@iam/domain/model/user-account.entity';
import {UserApiEndpoint} from '@iam/infrastructure/api/user-api-endpoint';
import {User} from '@iam/domain/model/user.entity';

@Injectable({
  providedIn: 'root'
})
export class IamApi extends BaseApi {
  private readonly userAccountsEndpoint:     UserAccountsApiEndpoint;
  private readonly usersEndpoint:            UserApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.userAccountsEndpoint = new UserAccountsApiEndpoint(http);
    this.usersEndpoint = new UserApiEndpoint(http);
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

}
