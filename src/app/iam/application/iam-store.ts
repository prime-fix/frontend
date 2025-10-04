import {computed, Injectable, Signal, signal} from '@angular/core';
import {UserAccount} from '@iam/domain/model/user-account.entity';
import {UserAccountApi} from '@iam/infrastructure/api/user-account-api';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class IamStore {
  private readonly userAccountsSignal = signal<UserAccount[]>([]);

  readonly userAccounts = this.userAccountsSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  readonly userAccountCount = computed(() => this.userAccounts().length);


  constructor(private userAccountApi : UserAccountApi) {
    this.loadUserAccounts();
  }

  getUserAccountById(id: string | null  | undefined): Signal<UserAccount | undefined> {
    return computed(() => id ? this.userAccounts().find(u => u.id === id) : undefined);
  }

  private loadUserAccounts(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.userAccountApi.getUserAccounts().pipe(takeUntilDestroyed()).subscribe({
      next: userAccounts => {
        console.log(userAccounts);
        this.userAccountsSignal.set(userAccounts);
        this.loadingSignal.set(false);

        const testId = 'UA001';

        const userSignal = this.getUserAccountById(testId);

        const foundUser = userSignal();

        console.log(`Buscando usuario con ID ${testId}:`, foundUser);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load user accounts'));
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
