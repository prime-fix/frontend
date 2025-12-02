import {computed, inject, Injectable, Signal, signal} from '@angular/core';
import {UserAccount} from '@iam/domain/model/user-account.entity';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {User} from '@iam/domain/model/user.entity';
import {IamApi} from '@iam/infrastructure/api/iam-api';
import {retry} from 'rxjs';
import {Location} from '@catalog/domain/model/location.entity';
import {MembershipChoiceType} from '@iam/domain/types/membership-choice.type';
import {CatalogStore} from '@catalog/application/catalog-store';
import {PaymentServiceStore} from '@payment/application/payment-service-store';
import {Payment} from '@payment/domain/model/payment.entity';
import {Membership} from '@iam/domain/model/membership.entity';
import {Role} from '@iam/domain/model/role.entity';

/**
 * State management service for Identity and Access Management (IAM).
 */
@Injectable({
  providedIn: 'root'
})
export class IamStore {
  /**
   * Reference to the CatalogStore for accessing catalog-related data.
   * @private
   */
  private readonly catalogStore = inject(CatalogStore);

  /**
   * Reference to the PaymentServiceStore for accessing payment-related data.
   * @private
   */
  private readonly paymentServiceStore = inject(PaymentServiceStore);

  /**
   * Signals to hold the state of user accounts, users, payments, and locations.
   * @private
   */
  private readonly userAccountsSignal = signal<UserAccount[]>([]);
  /**
   * Signals to hold the state of users.
   * @private
   */
  private readonly usersSignal = signal<User[]>([]);

  /**
   * Signals to hold the state of roles.
   * @private
   */
  private readonly rolesSignal = signal<Role[]>([]);

  /**
   * Signals to hold the state of memberships.
   * @private
   */
  private readonly membershipsSignal = signal<Membership[]>([]);

  /**
   * Readonly versions of the state signals for external access.
   */
  readonly userAccounts = this.userAccountsSignal.asReadonly();
  /**
   * Readonly version of users signal.
   */
  readonly users = this.usersSignal.asReadonly();
  /**
   * Readonly version of roles signal.
   */
  readonly roles = this.rolesSignal.asReadonly();
  /**
   * Readonly version of memberships signal.
   */
  readonly memberships = this.membershipsSignal.asReadonly();
  /**
   * Readonly version of payments signal.
   */
  readonly payments = this.paymentServiceStore.payments;
  /**
   * Readonly version of locations signal.
   */
  readonly locations = this.catalogStore.locations;
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
   * Computed properties to get counts of user accounts, users, payments, and locations.
   */
  readonly userAccountCount = computed(() => this.userAccounts().length);
  /**
   * Computed property to get the count of users.
   */
  readonly userCount = computed(() => this.users().length);
  /**
   * Computed property to get the count of roles.
   */
  readonly roleCount = computed(() => this.roles().length);
  /**
   * Computed property to get the count of memberships.
   */
  readonly membershipCount = computed(() => this.memberships().length);
  /**
   * Computed property to get the count of payments.
   */
  readonly paymentCount = computed(() => this.paymentServiceStore.paymentCount());
  /**
   * Computed property to get the count of locations.
   */
  readonly locationCount = computed(() => this.catalogStore.locationCount());

  // Session-related signals
  /**
   * Signal to hold the currently authenticated user account.
   * @private
   */
  private readonly sessionUserAccountSignal = signal<UserAccount | null>(null);
  /**
   * Signal to hold the currently authenticated user.
   * @private
   */
  private readonly sessionUserSignal = signal<User | null>(null);

  /**
   * Readonly versions of session signals for external access.
   */
  readonly sessionUserAccount = this.sessionUserAccountSignal.asReadonly()
  /**
   * Readonly version of session user signal.
   */
  readonly sessionUser = this.sessionUserSignal.asReadonly()

  /**
   * Computed properties for session state
   */
  readonly isAuthenticated = computed(() => !!this.sessionUserAccount());
  /**
   * Computed property to get the role ID of the authenticated user.
   */
  readonly roleId = computed(() => this.sessionUserAccount()?.role_id ?? '');
  /**
   * Computed property to get the full name of the authenticated user.
   */
  readonly fullName = computed(() => {
    const user = this.sessionUser();
    return user ? `${user.name} ${user.last_name}` : '';
  });
  /**
   * Computed property to get the current session user ID.
   * This is the id_user from the User entity.
   */
  readonly sessionUserId = computed(() => this.sessionUser()?.id ?? null);
  /**
   * Computed property to get the current session user account ID.
   * This is the id_user_account from the UserAccount entity.
   */
  readonly sessionUserAccountId = computed(() => this.sessionUserAccount()?.id ?? null);

  // Register Transition Flow
  /**
   * Signals to manage the registration flow state.
   * @private
   */
  private readonly registerUserSignal = signal<User | null>(null);
  /**
   * Signal to hold the user account being registered.
   * @private
   */
  private readonly registerUserAccountSignal = signal<UserAccount | null>(null);
  /**
   * Signal to hold the payment information during registration.
   * @private
   */
  private readonly registerPaymentSignal = signal<Payment | null>(null);
  /**
   * Signal to hold the role selected during registration.
   * @private
   */
  private readonly registerRoleSignal = signal<string | null>(null);
  /**
   * Signal to hold the location being registered.
   * @private
   */
  private readonly registerLocationSignal = signal<Location | null>(null);
  /**
   * Signal to hold the membership type selected during registration.
   * @private
   */
  private readonly registerMemberShipTypeSignal = signal<number | null>(null);

  /**
   * Readonly versions of registration signals for external access.
   */
  readonly registerUser = this.registerUserSignal.asReadonly();
  /**
   * Readonly version of registerUserAccount signal.
   */
  readonly registerUserAccount = this.registerUserAccountSignal.asReadonly();
  /**
   * Readonly version of registerPayment signal.
   */
  readonly registerPayment = this.registerPaymentSignal.asReadonly();
  /**
   * Readonly version of registerRole signal.
   */
  readonly registerRole = this.registerRoleSignal.asReadonly();
  /**
   * Readonly version of registerLocation signal.
   */
  readonly registerLocation = this.registerLocationSignal.asReadonly();
  /**
   * Readonly version of registerMemberShipType signal.
   */
  readonly registerMemberShipType = this.registerMemberShipTypeSignal.asReadonly();

  /**
   * Constructor to initialize the IAM store and load initial data.
   * @param iamApi
   */
  constructor(private iamApi: IamApi) {
    this.loadUserAccounts();
    this.loadUsers();
    this.loadRoles();
    this.loadMemberships();

    // Restore session from localStorage on app initialization
    this.restoreSessionFromStorage();
  }

  /**
   * Checks if a given user ID matches the current session user ID.
   * Useful for filtering data in other bounded contexts.
   * @param userId - The user ID to check
   * @returns true if the user ID matches the current session user ID
   */
  isCurrentUser(userId: number | null | undefined): boolean {
    const currentUserId = this.sessionUserId();
    if (!currentUserId || !userId) {
      return false;
    }
    return String(userId) === String(currentUserId);
  }

  /**
   * Checks if a given user account ID matches the current session user account ID.
   * @param userAccountId - The user account ID to check
   * @returns true if the user account ID matches the current session user account ID
   */
  isCurrentUserAccount(userAccountId: string | null | undefined): boolean {
    const currentUserAccountId = this.sessionUserAccountId();
    if (!currentUserAccountId || !userAccountId) {
      return false;
    }
    return String(userAccountId) === String(currentUserAccountId);
  }

  /**
   * Restores session from localStorage if valid session data exists.
   * @private
   */
  private restoreSessionFromStorage(): void {
    if (typeof localStorage === 'undefined') {
      console.warn("localStorage is not available in this environment.");
      return;
    }

    try {
      const sessionData = localStorage.getItem('prime-fix-session');
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        const {userAccount: rawUserAccount, user: rawUser} = parsed;
        const hasUserAccountData = rawUserAccount
          && typeof rawUserAccount._id_role === 'string'
          && rawUserAccount._id_role.length > 0
          && (rawUserAccount._id_role === 'R001' || rawUserAccount._id_role === 'R002');

        const hasUserData = rawUser
          && typeof rawUser._user_id === 'string'
          && rawUser._user_id.length > 0;

        if (hasUserAccountData && hasUserData) {
          const userAccount = new UserAccount({
            id: rawUserAccount._id,
            username: rawUserAccount._username,
            email: rawUserAccount._email,
            user_id: rawUserAccount._user_id,
            role_id: rawUserAccount._role_id,
            membership_id: rawUserAccount._membership_id,
            password: rawUserAccount._password,
            is_new: rawUserAccount._is_new
          });

          const user = new User({
            id: rawUser._id,
            name: rawUser._name,
            last_name: rawUser._last_name,
            dni: rawUser._dni,
            phone_number: rawUser._phone_number,
            location_id: rawUser._location_id
          });

          this.sessionUserAccountSignal.set(userAccount);
          this.sessionUserSignal.set(user);
          const roleName = userAccount.role_id === 1 ? 'Vehicle Owner' : 'Auto Repair Workshop';
          console.log(`Session restored: User ${userAccount.username || userAccount.email || user.name || 'Unknown'} with role ${userAccount.role_id} (${roleName})`);
        } else {
          console.error('NOT LOGGED - Corrupted session detected and cleared:', {
            hasUserAccount: !!rawUserAccount,
            hasValidRole: hasUserAccountData,
            roleValue: rawUserAccount?._id_role,
            hasUser: !!rawUser,
            hasValidUserId: hasUserData
          });
          console.error('Corrupted session data:', parsed);
          this.clearSessionStorage();
          console.log('Please login again to create a new valid session');
        }
      } else {
        console.log('NOT LOGGED - No session found in localStorage');
      }
    } catch (error) {
      console.warn('NOT LOGGED - Failed to restore session from localStorage:', error);
      this.clearSessionStorage();
    }
  }

  /**
   * Saves current session to localStorage
   */
  private saveSessionToStorage(): void {
    try {
      const userAccount = this.sessionUserAccount();
      const user = this.sessionUser();

      if (userAccount && user) {
        const sessionData = {
          userAccount,
          user,
          timestamp: Date.now()
        };
        localStorage.setItem('prime-fix-session', JSON.stringify(sessionData));
      }
    } catch (error) {
      console.warn('Failed to save session to localStorage:', error);
    }
  }

  /**
   * Clears session data from localStorage
   */
  private clearSessionStorage(): void {
    if (typeof localStorage === 'undefined') {
      console.warn("localStorage is not available in this environment.");
      return;
    }

    try {
      localStorage.removeItem('prime-fix-session');
    } catch (error) {
      console.warn('Failed to clear session from localStorage:', error);
    }
  }

  /**
   * Gets a location by its ID.
   * @param id
   */
  getLocationById(id: number | null | undefined): Signal<Location | undefined> {
    // delegate to CatalogStore
    return this.catalogStore.getLocationById(id);
  }

  /**
   * Adds a new location.
   * @param location - The location to add.
   * @returns void
   */
  addLocation(location: Location): void {
    // delegate to CatalogStore
    this.catalogStore.addLocation(location);
  }

  /**
   * Updates an existing location.
   * @param location - The location to update.
   * @returns void
   */
  updateLocation(location: Location): void {
    // delegate to CatalogStore
    this.catalogStore.updateLocation(location);
  }

  /**
   * Deletes a location by ID.
   * @param id - The ID of the location to delete.
   * @returns void
   */
  deleteLocation(id: number): void {
    // delegate to CatalogStore
    this.catalogStore.deleteLocation(id);
  }

  /**
   * Gets a user by their ID.
   * @param id - The ID of the user to retrieve.
   * @return A signal containing the user or undefined if not found.
   */
  getUserById(id: number | null | undefined): Signal<User | undefined> {
    return computed(() => id ? this.users().find(u => u.id === id) : undefined);
  }

  getUserAccountById(id: number | null | undefined): Signal<UserAccount | undefined> {
    return computed(() => id ? this.userAccounts().find(ua => ua.id === id) : undefined);
  }

  getRoleById(id: number | null | undefined): Signal<Role | undefined> {
    return computed(() => id ? this.roles().find(r => r.id === id) : undefined);
  }

  getMembershipById(id: number | null | undefined): Signal<Membership | undefined> {
    return computed(() => id ? this.memberships().find(m => m.id === id) : undefined);
  }

  /**
   * Adds a new user account.
   * @param userAccount - The user account to add.
   */
  addUserAccount(userAccount: UserAccount): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.createUserAccount(userAccount).pipe(retry(2)).subscribe({
      next: createdUserAccount => {
        this.userAccountsSignal.set([...this.userAccounts(), createdUserAccount]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create user account'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Updates an existing user account.
   * @param updatedUserAccount - The user account with updated information.
   */
  updateUserAccount(updatedUserAccount: UserAccount): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.updateUserAccount(updatedUserAccount).pipe(retry(2)).subscribe({
      next: userAccount => {
        this.userAccountsSignal.update(userAccounts =>
        userAccounts.map(ua => ua.id === userAccount.id ? userAccount : ua))
        if (this.sessionUserAccount()?.id === userAccount.id) {
          this.sessionUserAccountSignal.set(userAccount);
          this.saveSessionToStorage(); // Update session in localStorage if current user account is updated
        }
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update user account'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Deletes a user account by ID.
   * @param id - The ID of the user account to delete.
   */
  deleteUserAccount(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.deleteUserAccount(id).pipe(retry(2)).subscribe({
      next: () => {
        this.userAccountsSignal.update(userAccounts => userAccounts.filter(ua => ua.id !== id))
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete user account'));
        this.loadingSignal.set(false);
      }
    })
  }

  /**
   * Adds a new user.
   * @param user - The user to add.
   */
  addUser(user: User): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.createUser(user).pipe(retry(2)).subscribe({
      next: createdUser => {
        this.usersSignal.set([...this.users(), createdUser]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create user'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Updates an existing user.
   * @param updatedUser - The user with updated information.
   */
  updateUser(updatedUser: User): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.updateUser(updatedUser).pipe(retry(2)).subscribe({
      next: user => {
        this.usersSignal.update(users =>
          users.map(u => u.id === user.id ? user : u))
        if (this.sessionUser()?.id === user.id) {
          this.sessionUserSignal.set(user);
          this.saveSessionToStorage(); // Update session in localStorage if current user is updated
        }
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update user'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Deletes a user by ID.
   * @param id - The ID of the user to delete.
   */
  deleteUser(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.deleteUser(id).pipe(retry(2)).subscribe({
      next: () => {
        this.usersSignal.update(users => users.filter(u => u.id !== id))
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete user'));
        this.loadingSignal.set(false);
      }
    });
  }

  addRole(role: Role): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.createRole(role).pipe(retry(2)).subscribe({
      next: newRole => {
        this.rolesSignal.set([...this.roles(), newRole]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create role'));
        this.loadingSignal.set(false);
      }
    });
  }

  updateRole(role: Role): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.updateRole(role).pipe(retry(2)).subscribe({
      next: updatedRole => {
        this.rolesSignal.update(roles =>
          roles.map(r => r.id === updatedRole.id ? updatedRole : r));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update role'));
        this.loadingSignal.set(false);
      }
    });
  }

  deleteRole(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.deleteRole(id).pipe(retry(2)).subscribe({
      next: () => {
        this.rolesSignal.update(roles => roles.filter(r => r.id !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete role'));
        this.loadingSignal.set(false);
      }
    });
  }

  addMembership(membership: Membership): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.createMembership(membership).pipe(retry(2)).subscribe({
      next: newMembership => {
        this.membershipsSignal.set([...this.memberships(), newMembership]);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to create membership'));
        this.loadingSignal.set(false);
      }
    })
  }

  updateMembership(membership: Membership): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.updateMembership(membership).pipe(retry(2)).subscribe({
      next: updatedMembership => {
        this.membershipsSignal.update(memberships =>
          memberships.map(m => m.id === updatedMembership.id ? updatedMembership : m)
        );
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update membership'));
        this.loadingSignal.set(false);
      }
    })
  }

  deleteMembership(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.deleteMembership(id).pipe(retry(2)).subscribe({
      next: () => {
        this.membershipsSignal.update(memberships => memberships.filter(m => m.id !== id));
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to delete membership'));
        this.loadingSignal.set(false);
      }
    })
  }

  /**
   * Gets a payment by its ID.
   * @param payment - The ID of the payment to retrieve.
   */
  addPayment(payment: Payment): void {
    // delegate to PaymentServiceStore
    this.paymentServiceStore.addPayment(payment);
  }

  /**
   * Updates an existing payment.
   * @param updatedPayment - The payment with updated information.
   */
  updatePayment(updatedPayment: Payment): void {
    // delegate to PaymentServiceStore
    this.paymentServiceStore.updatePayment(updatedPayment);
  }

  /**
   * Deletes a payment by ID.
   * @param id - The ID of the payment to delete.
   */
  deletePayment(id: number): void {
    // delegate to PaymentServiceStore
    this.paymentServiceStore.deletePayment(id);
  }

  /**
   * Loads user accounts from the API and updates the state signal.
   * @private - This method is intended for internal use only.
   */
  private loadUserAccounts(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.getUserAccounts().pipe(takeUntilDestroyed()).subscribe({
      next: userAccounts => {
        console.log(userAccounts);
        this.userAccountsSignal.set(userAccounts);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load user accounts'));
        this.loadingSignal.set(false);
      }
    })
  }

  /**
   * Loads users from the API and updates the state signal.
   * @private - This method is intended for internal use only.
   */
  private loadUsers(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.getUsers().pipe(takeUntilDestroyed()).subscribe({
      next: users => {
        console.log(users);
        this.usersSignal.set(users);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load users'));
        this.loadingSignal.set(false);
      }
    })
  }

  /**
   * Loads roles from the API and updates the state signal.
   * @private - This method is intended for internal use only.
   */
  private loadRoles(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.getRoles().pipe(takeUntilDestroyed()).subscribe({
      next: roles => {
        console.log(roles);
        this.rolesSignal.set(roles);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load roles'));
        this.loadingSignal.set(false);
      }
    })
  }

  /**
   * Loads memberships from the API and updates the state signal.
   * @private - This method is intended for internal use only.
   */
  private loadMemberships(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.getMemberships().pipe(takeUntilDestroyed()).subscribe({
      next: memberships => {
        console.log(memberships);
        this.membershipsSignal.set(memberships);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load memberships'));
        this.loadingSignal.set(false);
      }
    })
  }

  /**
   * Simulates user login by checking credentials against stored user accounts and users.
   * @param email - The email of the user trying to log in.
   * @param password - The password of the user trying to log in.
   */
  login(email: string, password: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const tryFromMemory = () => {
      const account = this.userAccounts().find(a => a.email?.toLowerCase() === email.toLowerCase());
      if (!account) {
        this.errorSignal.set('User or password incorrect');
        this.loadingSignal.set(false);
        return;
      }

      if (!password || password.length < 1) {
        this.errorSignal.set('Password is required');
        this.loadingSignal.set(false);
        return;
      }

      const storedPassword = account.password ?? '';
      if (storedPassword !== password) {
        this.errorSignal.set('User or password incorrect');
        this.loadingSignal.set(false);
        return;
      }

      const user = this.users().find(u => u.id === account.user_id);
      if (!user) {
        this.errorSignal.set('User or password incorrect');
        this.loadingSignal.set(false);
        return;
      }
      this.sessionUserAccountSignal.set(account);
      this.sessionUserSignal.set(user);
      this.saveSessionToStorage(); // Save session to localStorage
      this.loadingSignal.set(false);
    };

    if (!this.userAccounts().length || !this.users().length) {
      this.iamApi.getUserAccounts().pipe(takeUntilDestroyed()).subscribe({
        next: userAccounts => {
          this.userAccountsSignal.set(userAccounts);
          this.iamApi.getUsers().pipe(takeUntilDestroyed()).subscribe({
            next: users => {
              this.usersSignal.set(users);
              tryFromMemory();
            },
            error: err => {
              this.errorSignal.set(this.formatError(err, 'Failed to load users'));
              this.loadingSignal.set(false);
            }
          });
        },
        error: err => {
          this.errorSignal.set(this.formatError(err, 'Failed to load user accounts'));
          this.loadingSignal.set(false);
        }})
    } else {
      tryFromMemory();
    }
  }

  /**
   * Logs out the current user by clearing session-related signals.
   */
  logout(): void {
    this.sessionUserAccountSignal.set(null);
    this.sessionUserSignal.set(null);
    this.clearSessionStorage(); // Clear session from localStorage on logout
  }

  /**
   * Initiates the registration process by setting the role and resetting other registration signals.
   * @param role - The role of the user ('Vehicle Owner' or 'Auto Repair Shop').
   */
  startRegistrationFlow(role: 'Vehicle Owner' | 'Auto Repair Shop'): void {
    this.registerRoleSignal.set(role);
    this.registerUserSignal.set(null);
    this.registerUserAccountSignal.set(null);
    this.registerPaymentSignal.set(null);
    this.registerMemberShipTypeSignal.set(null);
    this.errorSignal.set(null);
  }

  /**
   * Saves the registration details for a vehicle owner.
   * @param form - The registration form data.
   */
  saveRegisterOwner(form: { fullName: string; username: string; dni: string; phone_number:
      string; department: string; district: string; address: string; email: string; password: string }): void {

    const newLocation = new Location({
      id: 0, // Assign ID in the Backend
      department: form.department,
      district: form.district,
      address: form.address
    })

    const newUser = new User({
      id: 0, // Assign ID in the Backend
      name: form.fullName.split(' ')[0] || '',
      last_name: form.fullName.split(' ').slice(1).join(' '),
      dni: form.dni,
      phone_number: form.phone_number,
      location_id: newLocation.id,
    })

    const newUserAccount = new UserAccount({
      id: 0, // Assign ID in the Backend
      username: form.username.trim(),
      email: form.email.trim(),
      user_id: newUser.id,
      role_id: 1, // Vehicle Owner role
      membership_id: 0, // No membership at registration
      password: form.password,
      is_new: true // Mark as new user
    });

    this.registerLocationSignal.set(newLocation);
    this.registerUserSignal.set(newUser);
    this.registerUserAccountSignal.set(newUserAccount);
  }

  /**
   * Saves the registration details for an auto repair shop.
   * @param form - The registration form data.
   */
  saveRegisterWorkshop(form: { name_workshop: string; username: string; ruc:
      string; phone_number: string; department: string; district: string; address: string; email: string; password: string }): void {

    const newLocation = new Location({
      id: 0, // Assign ID in the Backend
      department: form.department,
      district: form.district,
      address: form.address
    })

    const newUser = new User({
      id: 0, // Assign ID in the Backend
      name: form.name_workshop,
      last_name: '',
      dni: form.ruc,
      phone_number: form.phone_number,
      location_id: newLocation.id,
    })

    const newUserAccount = new UserAccount({
      id: 0, // Assign ID in the Backend
      username: form.username.trim(),
      email: form.email.trim(),
      user_id: newUser.id,
      role_id: 2,  // Auto Repair Workshop role
      membership_id: 0, // No membership at registration
      password: form.password,
      is_new: true // Mark as new user
    });

    this.registerLocationSignal.set(newLocation);
    this.registerUserSignal.set(newUser);
    this.registerUserAccountSignal.set(newUserAccount);
  }

  /**
   * Sets the selected membership plan during registration.
   * @param plan - The selected plan ('1m', '3m', or '12m').
   */
  selectPlan(plan: '1m'| '3m' | '12m') {
    const membershipId = MembershipChoiceType[plan];
    this.registerMemberShipTypeSignal.set(membershipId);

    const userAccountNoMembership = this.registerUserAccountSignal();
    if (userAccountNoMembership) {
      userAccountNoMembership.membership_id = membershipId;
      this.registerUserAccountSignal.set(userAccountNoMembership);
    }
  }

  /**
   * Finalizes the registration process by creating and storing all related entities.
   * @param payment - The payment information provided during registration.
   */
  finishRegister(payment: { card_number: number; month: number; year:number; cvv: number; card_type: string; }): void {
    const role = this.registerRoleSignal();
    const user = this.registerUserSignal();
    const userAccount = this.registerUserAccountSignal();
    const location = this.registerLocationSignal();
    const membershipId = this.registerMemberShipTypeSignal();

    if(!role || !user || !userAccount || !location || !membershipId || !payment) {
      this.errorSignal.set('Incomplete registration flow');
      return;
    }

    const newPayment = new Payment({
      id: 0, // Assign ID in the Backend
      card_number: payment.card_number,
      card_type: payment.card_type,
      month: payment.month,
      year: payment.year,
      cvv: payment.cvv,
      user_account_id: userAccount.id
    });

    console.log(location);
    console.log(user);
    console.log(userAccount);
    console.log(newPayment);

    this.addLocation(location);
    this.addUser(user);
    this.addUserAccount(userAccount);
    this.addPayment(newPayment);
  }

  /**
   * Resets the entire registration flow, clearing all related signals.
   */
  resetRegistrationFlow() {
    this.registerRoleSignal.set(null);
    this.registerUserSignal.set(null);
    this.registerUserAccountSignal.set(null);
    this.registerPaymentSignal.set(null);
    this.registerLocationSignal.set(null);
    this.registerMemberShipTypeSignal.set(null);
    this.errorSignal.set(null);
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
