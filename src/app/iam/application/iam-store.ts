import {computed, Injectable, Signal, signal} from '@angular/core';
import {UserAccount} from '@iam/domain/model/user-account.entity';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {User} from '@iam/domain/model/user.entity';
import {IamApi} from '@iam/infrastructure/api/iam-api';
import {retry} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IamStore {
  private readonly userAccountsSignal = signal<UserAccount[]>([]);
  private readonly usersSignal = signal<User[]>([]);

  readonly userAccounts = this.userAccountsSignal.asReadonly();
  readonly users = this.usersSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly userAccountCount = computed(() => this.userAccounts().length);
  readonly userCount = computed(() => this.users().length);


  constructor(private iamApi : IamApi) {
    this.loadUserAccounts();
    this.loadUsers();
  }

  getUserById(id: string | null  | undefined): Signal<User | undefined> {
    return computed(() => id ? this.users().find(u => u.id === id) : undefined);
  }

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

  updateUserAccount(updatedUserAccount: UserAccount): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.updateUserAccount(updatedUserAccount).pipe(retry(2)).subscribe({
      next: userAccount => {
        this.userAccountsSignal.update(userAccounts =>
        userAccounts.map(ua => ua.id === userAccount.id ? userAccount : ua))
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update user account'));
        this.loadingSignal.set(false);
      }
    });
  }

  deleteUserAccount(id: string): void {
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

  updateUser(updatedUser: User): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.iamApi.updateUser(updatedUser).pipe(retry(2)).subscribe({
      next: user => {
        this.usersSignal.update(users =>
          users.map(u => u.id === user.id ? user : u))
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update user'));
        this.loadingSignal.set(false);
      }
    });
  }

  deleteUser(id: string): void {
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
