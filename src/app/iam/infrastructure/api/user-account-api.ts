import { Injectable } from '@angular/core';
import {BaseApi} from '@shared/infrastructure/http/base-api';
import {UserAccountsApiEndpoint} from '@iam/infrastructure/api/user-accounts-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserAccount} from '@iam/domain/model/user-account.entity';

@Injectable({
  providedIn: 'root'
})
export class UserAccountApi extends BaseApi {
  private readonly userAccountsEndpoint:     UserAccountsApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.userAccountsEndpoint = new UserAccountsApiEndpoint(http);
  }

  getUserAccounts(): Observable<UserAccount[]> {
    return this.userAccountsEndpoint.getAll();
  }

  getUserAccount(id: string): Observable<UserAccount> {
    return this.userAccountsEndpoint.getById(id);
  }

}
