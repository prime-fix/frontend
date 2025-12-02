import { Injectable } from '@angular/core';
import {BaseApi} from '@shared/infrastructure/http/base-api';
import {UserAccountsApiEndpoint} from '@iam/infrastructure/api/user-accounts-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserAccount} from '@iam/domain/model/user-account.entity';
import {UserApiEndpoint} from '@iam/infrastructure/api/user-api-endpoint';
import {User} from '@iam/domain/model/user.entity';
import {RolesApiEndpoint} from '@iam/infrastructure/api/roles-api-endpoint';
import {Role} from '@iam/domain/model/role.entity';
import {MembershipsApiEndpoint} from '@iam/infrastructure/api/memberships-api-endpoint';
import {Membership} from '@iam/domain/model/membership.entity';

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
   * API endpoint for role-related operations.
   * @private
   */
  private readonly rolesEndpoint:            RolesApiEndpoint;
  /**
   * API endpoint for membership-related operations.
   * @private
   */
  private readonly membershipsEndpoint:      MembershipsApiEndpoint;

  /**
   * Constructor to initialize the IAM API service with the necessary endpoints.
   * @param http - The HttpClient instance for making HTTP requests.
   */
  constructor(http: HttpClient) {
    super();
    this.userAccountsEndpoint = new UserAccountsApiEndpoint(http);
    this.usersEndpoint = new UserApiEndpoint(http);
    this.rolesEndpoint = new RolesApiEndpoint(http);
    this.membershipsEndpoint = new MembershipsApiEndpoint(http);
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
  getUserAccount(id: number): Observable<UserAccount> {
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
  deleteUserAccount(id: number): Observable<void> {
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
  getUser(id: number): Observable<User> {
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
  deleteUser(id: number): Observable<void> {
    return this.usersEndpoint.delete(id);
  }

  /**
   * Fetches all roles from the backend.
   * @returns An Observable emitting an array of Role entities.
   */
  getRoles(): Observable<Role[]> {
    return this.rolesEndpoint.getAll();
  }

  /**
   * Fetches a specific role by its ID.
   * @param id - The ID of the role to be fetched.
   * @return An Observable emitting the Role entity.
   */
  getRole(id: number): Observable<Role> {
    return this.rolesEndpoint.getById(id);
  }

  /**
   * Creates a new role.
   * @param role - The Role entity to be created.
   */
  createRole(role: Role): Observable<Role> {
    return this.rolesEndpoint.create(role);
  }

  /**
   * Updates an existing role.
   * @param role - The Role entity with updated information.
   */
  updateRole(role: Role): Observable<Role> {
    return this.rolesEndpoint.update(role, role.id);
  }

  /**
   * Deletes a role by its ID.
   * @param id - The ID of the role to be deleted.
   */
  deleteRole(id: number): Observable<void> {
    return this.rolesEndpoint.delete(id);
  }

  /**
   * Fetches all memberships from the backend.
   * @returns An Observable emitting an array of Membership entities.
   */
  getMemberships(): Observable<Membership[]> {
    return this.membershipsEndpoint.getAll();
  }

  /**
   * Fetches a specific membership by its ID.
   * @param id - The ID of the membership to be fetched.
   * @return An Observable emitting the Membership entity.
   */
  getMembership(id: number): Observable<Membership> {
    return this.membershipsEndpoint.getById(id);
  }

  /**
   * Creates a new membership.
   * @param membership - The Membership entity to be created.
   * @return An Observable emitting the created Membership entity.
   */
  createMembership(membership: Membership): Observable<Membership> {
    return this.membershipsEndpoint.create(membership);
  }

  /**
   * Updates an existing membership.
   * @param membership - The Membership entity with updated information.
   * @return An Observable emitting the updated Membership entity.
   */
  updateMembership(membership: Membership): Observable<Membership> {
    return this.membershipsEndpoint.update(membership, membership.id);
  }

  /**
   * Deletes a membership by its ID.
   * @param id - The ID of the membership to be deleted.
   * @return An Observable emitting void upon successful deletion.
   */
  deleteMembership(id: number): Observable<void> {
    return this.membershipsEndpoint.delete(id);
  }
}
