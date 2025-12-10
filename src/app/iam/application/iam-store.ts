import {computed, DestroyRef, inject, Injectable, Signal, signal} from '@angular/core';
import {UserAccount} from '@iam/domain/model/user-account.entity';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {User} from '@iam/domain/model/user.entity';
import {IamApi} from '@iam/infrastructure/api/iam-api';
import {AuthApi} from '@iam/infrastructure/api/auth-api';
import {retry} from 'rxjs';
import {Location} from '@catalog/domain/model/location.entity';
import {MembershipChoiceType} from '@iam/domain/types/membership-choice.type';
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
   * DestroyRef to clean up subscriptions on destroy.
   * @private
   */
  private destroyRef = inject(DestroyRef);
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
   * Only loads data if there's an active session (JWT exists)
   * @param iamApi
   * @param authApi
   */
  constructor(private iamApi: IamApi, private authApi: AuthApi) {
    // Restore session from localStorage first
    this.restoreSessionFromStorage();

    // Only load data if we have a valid session with JWT
    // This prevents unnecessary API calls and fallback activation on app init
    const hasValidSession = this.hasValidJWT();

    if (hasValidSession) {
      console.log('✅ Valid JWT found, loading user data...');
      this.loadUserAccounts();
      this.loadUsers();
      this.loadRoles();
      this.loadMemberships();
    } else {
      console.log('⚠️ No valid JWT, skipping data load on init');
    }
  }

  /**
   * Check if there's a valid JWT in localStorage
   * @private
   */
  private hasValidJWT(): boolean {
    try {
      const authData = localStorage.getItem('pf_iam_auth');
      if (!authData) return false;

      const parsed = JSON.parse(authData);
      return !!parsed?.token?.accessToken;
    } catch {
      return false;
    }
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
    return userId === currentUserId;
  }

  /**
   * Checks if a given user account ID matches the current session user account ID.
   * @param userAccountId - The user account ID to check
   * @returns true if the user account ID matches the current session user account ID
   */
  isCurrentUserAccount(userAccountId: number | null | undefined): boolean {
    const currentUserAccountId = this.sessionUserAccountId();
    if (!currentUserAccountId || !userAccountId) {
      return false;
    }
    return userAccountId === currentUserAccountId;
  }

  /**
   * Restores session from localStorage if valid session data exists.
   * @private
   */
  private restoreSessionFromStorage(): void {
    if (typeof localStorage === 'undefined') {
      console.warn("⚠️ localStorage is not available in this environment.");
      return;
    }

    try {
      const sessionData = localStorage.getItem('prime-fix-session');
      if (!sessionData) {
        console.log('ℹ️ No session found in localStorage');
        return;
      }

      const parsed = JSON.parse(sessionData);
      const {userAccount: rawUserAccount, user: rawUser, timestamp} = parsed;

      // Check session expiration (7 days)
      const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      if (timestamp && (Date.now() - timestamp > SESSION_MAX_AGE)) {
        console.warn('⚠️ Session expired, clearing...');
        this.clearSessionStorage();
        return;
      }

      // Validate user account data
      const hasUserAccountData = rawUserAccount
        && typeof rawUserAccount._role_id === 'number'
        && (rawUserAccount._role_id === 1 || rawUserAccount._role_id === 2)
        && rawUserAccount._username
        && rawUserAccount._id;

      // Validate user data
      const hasUserData = rawUser
        && typeof rawUser._id === 'number'
        && rawUser._id > 0
        && rawUser._name;

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
        const sessionAge = timestamp ? Math.floor((Date.now() - timestamp) / (1000 * 60 * 60)) : 0;

        console.log('✅ Session restored:', {
          username: userAccount.username,
          role: roleName,
          userId: user.id,
          sessionAge: sessionAge > 0 ? `${sessionAge} hours ago` : 'just now'
        });
      } else {
        console.error('❌ Corrupted session detected:', {
          hasUserAccount: !!rawUserAccount,
          hasValidRole: hasUserAccountData,
          roleValue: rawUserAccount?._role_id,
          hasUsername: !!rawUserAccount?._username,
          hasUser: !!rawUser,
          hasValidUserId: hasUserData,
          hasUserName: !!rawUser?._name
        });
        this.clearSessionStorage();
        console.log('ℹ️ Please login again to create a new valid session');
      }
    } catch (error) {
      console.error('❌ Failed to restore session from localStorage:', error);
      this.clearSessionStorage();
    }
  }

  /**
   * Saves current session to localStorage with JWT token
   * @param jwt - Optional JWT token from AWS sign-in
   */
  private saveSessionToStorage(jwt?: string): void {
    try {
      const userAccount = this.sessionUserAccount();
      const user = this.sessionUser();

      if (!userAccount || !user) {
        console.warn('⚠️ Cannot save session: userAccount or user is null', {
          hasUserAccount: !!userAccount,
          hasUser: !!user
        });
        return;
      }

      const sessionData = {
        userAccount,
        user,
        token: jwt ? { accessToken: jwt } : undefined,
        timestamp: Date.now()
      };

      localStorage.setItem('prime-fix-session', JSON.stringify(sessionData));
      console.log('✅ Session saved to localStorage', {
        username: userAccount.username,
        userId: user.id,
        hasJWT: !!jwt
      });

      // Also save in pf_iam_auth for interceptor compatibility
      if (jwt) {
        localStorage.setItem('pf_iam_auth', JSON.stringify({
          token: { accessToken: jwt },
          user: { id: userAccount.id, username: userAccount.username }
        }));
        console.log('✅ JWT saved for interceptor');
      }
    } catch (error) {
      console.error('❌ Failed to save session to localStorage:', error);
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
   * Gets a user by their ID.
   * @param id - The ID of the user to retrieve.
   * @return A signal containing the user or undefined if not found.
   */
  getUserById(id: number | null | undefined): Signal<User | undefined> {
    return computed(() => id ? this.users().find(u => u.id === id) : undefined);
  }

  /**
   * Gets a user account by its ID.
   *
   * @param id - The ID of the user account to retrieve.
   */
  getUserAccountById(id: number | null | undefined): Signal<UserAccount | undefined> {
    return computed(() => id ? this.userAccounts().find(ua => ua.id === id) : undefined);
  }

  /**
   * Gets a role by its ID.
   *
   * @param id - The ID of the role to retrieve.
   */
  getRoleById(id: number | null | undefined): Signal<Role | undefined> {
    return computed(() => id ? this.roles().find(r => r.id === id) : undefined);
  }

  /**
   * Gets a membership by its ID.
   *
   * @param id - The ID of the membership to retrieve.
   */
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
   * Loads user accounts from the API and updates the state signal.
   * @private - This method is intended for internal use only.
   */
  private loadUserAccounts(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.getUserAccounts().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
    this.iamApi.getUsers().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
    this.iamApi.getRoles().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
    this.iamApi.getMemberships().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
   * Forces all stores to load their data.
   * Used after Supabase login when there's no JWT.
   * This method temporarily sets a fake JWT to allow stores to load data.
   */
  forceLoadAllStoresData(): void {
    console.log('📤 Force loading all stores data (for Supabase login)...');

    // Temporarily set a fake JWT for Supabase to allow stores to load
    const fakeAuth = {
      token: { accessToken: 'supabase-fallback-no-jwt' },
      user: {
        id: this.sessionUserAccount()?.id || 0,
        username: this.sessionUserAccount()?.username || 'unknown'
      }
    };

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('pf_iam_auth', JSON.stringify(fakeAuth));
    }

    // Load IamStore data
    this.loadUserAccounts();
    this.loadUsers();
    this.loadRoles();
    this.loadMemberships();

    // Trigger other stores to load by dispatching a custom event
    // This will be caught by stores that listen to it
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('force-load-stores'));
    }

    console.log('✅ All stores triggered to load data');
  }

  /**
   * Login with AWS API (sign-in) using username and password.
   * AWS API returns: { id, username, token }
   * Then loads user account and user data from API (with fallback to Supabase)
   * @param username - The username of the user trying to log in
   * @param password - The password of the user trying to log in
   */
  login(username: string, password: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Sign in with AWS API
    this.authApi.signIn(username, password).subscribe({
      next: (response) => {
        console.log('✅ AWS Sign-in successful:', response);

        // Save JWT token IMMEDIATELY for interceptor to use in subsequent requests
        const jwt = response.token;
        localStorage.setItem('pf_iam_auth', JSON.stringify({
          token: { accessToken: jwt },
          user: { id: response.id, username: response.username }
        }));

        // Load user account by ID from API with JWT
        this.iamApi.getUserAccount(response.id).subscribe({
          next: (userAccount) => {
            console.log('✅ User account loaded:', userAccount);
            this.sessionUserAccountSignal.set(userAccount);

            // Load user by user_id from API
            if (userAccount.user_id) {
              this.iamApi.getUser(userAccount.user_id).subscribe({
                next: (user) => {
                  console.log('✅ User loaded:', user);
                  this.sessionUserSignal.set(user);

                  // Now save complete session with JWT
                  this.saveSessionToStorage(jwt);

                  // Load all data now that we have JWT
                  console.log('📤 Loading all store data with JWT...');
                  this.loadUserAccounts();
                  this.loadUsers();
                  this.loadRoles();
                  this.loadMemberships();

                  this.loadingSignal.set(false);
                },
                error: (err) => {
                  console.error('❌ Failed to load user:', err);
                  this.errorSignal.set(this.formatError(err, 'Failed to load user data'));
                  this.loadingSignal.set(false);
                }
              });
            } else {
              this.errorSignal.set('User account does not have associated user');
              this.loadingSignal.set(false);
            }
          },
          error: (err) => {
            console.error('❌ Failed to load user account:', err);
            this.errorSignal.set(this.formatError(err, 'Failed to load user account'));
            this.loadingSignal.set(false);
          }
        });
      },
      error: (err) => {
        console.error('❌ AWS Sign-in failed:', err);

        // Fallback: Try to login from Supabase data (for testing)
        console.warn('⚠️ Attempting fallback login with Supabase data...');
        this.loginFallbackSupabase(username, password);
      }
    });
  }

  /**
   * Fallback login method using Supabase data (for testing only)
   * Loads data from Supabase first, then searches in memory for user account by username and validates password
   * @private
   * @param username - The username to search for
   * @param password - The password to validate
   */
  private loginFallbackSupabase(username: string, password: string): void {
    const tryFromMemory = () => {
      // Normalize input
      const normalizedUsername = username.trim().toLowerCase();
      const normalizedPassword = password.trim();

      // Find user account
      const account = this.userAccounts().find(a =>
        a.username?.toLowerCase() === normalizedUsername ||
        a.email?.toLowerCase() === normalizedUsername
      );

      if (!account) {
        console.warn('⚠️ User not found:', normalizedUsername);
        this.errorSignal.set('Username or email not found');
        this.loadingSignal.set(false);
        return;
      }

      // Validate password
      if (!normalizedPassword || normalizedPassword.length < 1) {
        console.warn('⚠️ Password is empty');
        this.errorSignal.set('Password is required');
        this.loadingSignal.set(false);
        return;
      }

      // Note: Supabase stores plain password (only for testing)
      const storedPassword = (account.password ?? '').trim();
      if (storedPassword !== normalizedPassword) {
        console.warn('⚠️ Password mismatch for user:', account.username);
        this.errorSignal.set('Incorrect password');
        this.loadingSignal.set(false);
        return;
      }

      // Find related user
      const user = this.users().find(u => u.id === account.user_id);
      if (!user) {
        console.error('❌ User data not found for user_id:', account.user_id);
        this.errorSignal.set('User data incomplete. Please contact support.');
        this.loadingSignal.set(false);
        return;
      }

      // ✅ Login successful
      console.log('✅ Fallback Supabase login successful', {
        username: account.username,
        role_id: account.role_id,
        user_id: user.id
      });

      this.sessionUserAccountSignal.set(account);
      this.sessionUserSignal.set(user);
      this.saveSessionToStorage(); // Sin JWT para Supabase

      // Force load all stores data (including other bounded contexts)
      this.forceLoadAllStoresData();

      this.loadingSignal.set(false);
    };

    // Load data from Supabase
    console.log('📤 Loading user data from Supabase for fallback login...');
    this.iamApi.getUserAccounts().pipe(retry(1)).subscribe({
      next: userAccounts => {
        console.log(`✅ Loaded ${userAccounts.length} user accounts from Supabase`);
        this.userAccountsSignal.set(userAccounts);

        this.iamApi.getUsers().pipe(retry(1)).subscribe({
          next: users => {
            console.log(`✅ Loaded ${users.length} users from Supabase`);
            this.usersSignal.set(users);
            tryFromMemory();
          },
          error: err => {
            console.error('❌ Failed to load users from Supabase:', err);
            this.errorSignal.set('Failed to load user data. Please check your connection.');
            this.loadingSignal.set(false);
          }
        });
      },
      error: err => {
        console.error('❌ Failed to load user accounts from Supabase:', err);
        this.errorSignal.set('Failed to connect to authentication server. Please check your connection.');
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Logs out the current user by clearing session-related signals and storage.
   */
  logout(): void {
    const currentUsername = this.sessionUserAccount()?.username;

    console.log('🚪 Logging out user:', currentUsername || 'unknown');

    // Clear session signals
    this.sessionUserAccountSignal.set(null);
    this.sessionUserSignal.set(null);

    // Clear session from localStorage
    this.clearSessionStorage();

    // Clear JWT auth for interceptor
    try {
      localStorage.removeItem('pf_iam_auth');
      console.log('✅ Cleared authentication data');
    } catch (error) {
      console.error('❌ Failed to clear pf_iam_auth from localStorage:', error);
    }

    // Clear error state
    this.errorSignal.set(null);

    console.log('✅ Logout successful');
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
  finishRegister(payment: { card_number: string; month: number; year:number; cvv: number; card_type: string; }): void {
    const role = this.registerRoleSignal();
    const user = this.registerUserSignal();
    const userAccount = this.registerUserAccountSignal();
    const location = this.registerLocationSignal();
    const membershipId = this.registerMemberShipTypeSignal();

    if(!role || !user || !userAccount || !location || !membershipId || !payment) {
      console.error('❌ Incomplete registration flow:', {
        hasRole: !!role,
        hasUser: !!user,
        hasUserAccount: !!userAccount,
        hasLocation: !!location,
        hasMembershipId: !!membershipId,
        hasPayment: !!payment
      });
      this.errorSignal.set('Incomplete registration flow');
      return;
    }

    console.log('📋 Registration data collected:', {
      role,
      user: `${user.name} ${user.last_name}`,
      userAccount: userAccount.username,
      location: `${location.district}, ${location.department}`,
      membershipId,
      payment: payment.card_type
    });

    // Call the appropriate sign-up endpoint based on role
    // If AWS is available, it will create everything in one request
    // If AWS fails, the methods will fallback to Supabase and create entities individually
    if (role === 'Vehicle Owner') {
      this.registerVehicleOwner({
        fullName: `${user.name} ${user.last_name}`,
        username: userAccount.username,
        dni: user.dni,
        phone_number: user.phone_number,
        department: location.department,
        district: location.district,
        address: location.address,
        email: userAccount.email,
        password: userAccount.password
      });
    } else if (role === 'Auto Repair Shop') {
      this.registerAutoRepair({
        name_workshop: user.name, // Workshop name is stored in user.name
        username: userAccount.username,
        ruc: user.dni, // RUC is stored in user.dni for workshops
        phone_number: user.phone_number,
        department: location.department,
        district: location.district,
        address: location.address,
        email: userAccount.email,
        password: userAccount.password
      });
    } else {
      console.error('❌ Invalid role:', role);
      this.errorSignal.set('Invalid user role');
    }
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
   * Register a new vehicle owner with AWS API
   * Creates User + UserAccount, returns JWT and auto-login
   * If AWS fails, falls back to Supabase with FK order: Location → User → UserAccount → Payment
   * @param formData - Registration form data from register-owner component
   */
  registerVehicleOwner(formData: {
    fullName: string;
    username: string;
    dni: string;
    phone_number: string;
    department: string;
    district: string;
    address: string;
    email: string;
    password: string;
  }): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // Split fullName into name and lastName
    const nameParts = formData.fullName.trim().split(' ');
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    const name = nameParts[0];

    const signUpRequest = {
      user: {
        name: name,
        lastName: lastName,
        dni: formData.dni,
        phoneNumber: formData.phone_number,
        department: formData.department,
        district: formData.district,
        address: formData.address
      },
      userAccount: {
        username: formData.username,
        email: formData.email,
        password: formData.password
      }
    };

    console.log('📤 Registering vehicle owner with AWS:', signUpRequest);

    this.authApi.signUpVehicleOwner(signUpRequest).subscribe({
      next: (response) => {
        console.log('✅ Vehicle owner registration successful (AWS):', response);

        // Save JWT and auto-login
        const jwt = response.token;

        // Load user account and user data
        this.iamApi.getUserAccount(response.id).subscribe({
          next: (userAccount) => {
            console.log('✅ User account loaded after registration:', userAccount);
            this.sessionUserAccountSignal.set(userAccount);

            if (userAccount.user_id) {
              this.iamApi.getUser(userAccount.user_id).subscribe({
                next: (user) => {
                  console.log('✅ User loaded after registration:', user);
                  this.sessionUserSignal.set(user);
                  this.saveSessionToStorage(jwt);
                  this.loadingSignal.set(false);
                  // Auto-redirect to plan-owner will be handled by component effect
                },
                error: (err) => {
                  console.error('❌ Failed to load user after registration:', err);
                  this.errorSignal.set(this.formatError(err, 'Failed to load user data'));
                  this.loadingSignal.set(false);
                }
              });
            }
          },
          error: (err) => {
            console.error('❌ Failed to load user account after registration:', err);
            this.errorSignal.set(this.formatError(err, 'Failed to load user account'));
            this.loadingSignal.set(false);
          }
        });
      },
      error: (err) => {
        console.error('❌ AWS Vehicle owner registration failed:', err);
        console.warn('⚠️ Fallback registration with Supabase should be handled by component');
        this.errorSignal.set(this.formatError(err, 'Registration failed. Please try again.'));
        this.loadingSignal.set(false);
      }
    });
  }



  /**
   * Register a new auto repair workshop with AWS API
   * Creates AutoRepair + Location + User + UserAccount, returns JWT and auto-login
   * If AWS fails, falls back to Supabase with FK order: Location → AutoRepair → User → UserAccount → Payment
   * @param formData - Registration form data from register-workshop component
   */
  registerAutoRepair(formData: {
    name_workshop: string;
    username: string;
    ruc: string;
    phone_number: string;
    department: string;
    district: string;
    address: string;
    email: string;
    password: string;
  }): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    // For auto repair, we need user data (workshop representative)
    // Using workshop name as placeholder for username
    const signUpRequest = {
      autoRepair: {
        name: formData.name_workshop,
        ruc: formData.ruc
      },
      location: {
        department: formData.department,
        district: formData.district,
        address: formData.address
      },
      user: {
        name: formData.name_workshop, // Using workshop name as username
        lastName: 'Workshop', // Default lastName (you can add a field for this)
        dni: '00000000', // Placeholder DNI (you can add a field for this)
        phoneNumber: formData.phone_number
      },
      userAccount: {
        username: formData.username,
        email: formData.email,
        password: formData.password
      }
    };

    console.log('📤 Registering auto repair with AWS:', signUpRequest);

    this.authApi.signUpAutoRepair(signUpRequest).subscribe({
      next: (response) => {
        console.log('✅ Auto repair registration successful (AWS):', response);

        // Save JWT and auto-login
        const jwt = response.token;

        // Load user account and user data
        this.iamApi.getUserAccount(response.id).subscribe({
          next: (userAccount) => {
            console.log('✅ User account loaded after registration:', userAccount);
            this.sessionUserAccountSignal.set(userAccount);

            if (userAccount.user_id) {
              this.iamApi.getUser(userAccount.user_id).subscribe({
                next: (user) => {
                  console.log('✅ User loaded after registration:', user);
                  this.sessionUserSignal.set(user);
                  this.saveSessionToStorage(jwt);
                  this.loadingSignal.set(false);
                  // Auto-redirect to plan-workshop will be handled by component effect
                },
                error: (err) => {
                  console.error('❌ Failed to load user after registration:', err);
                  this.errorSignal.set(this.formatError(err, 'Failed to load user data'));
                  this.loadingSignal.set(false);
                }
              });
            }
          },
          error: (err) => {
            console.error('❌ Failed to load user account after registration:', err);
            this.errorSignal.set(this.formatError(err, 'Failed to load user account'));
            this.loadingSignal.set(false);
          }
        });
      },
      error: (err) => {
        console.error('❌ AWS Auto repair registration failed:', err);
        console.warn('⚠️ Fallback registration with Supabase should be handled by component');
        this.errorSignal.set(this.formatError(err, 'Registration failed. Please try again.'));
        this.loadingSignal.set(false);
      }
    });
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
