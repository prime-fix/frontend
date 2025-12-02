import {Component, ChangeDetectionStrategy, inject, computed} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {IamStore} from '@iam/application/iam-store';
import {UserAccount} from '@iam/domain/model/user-account.entity';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home-owner',
  imports: [
    TranslatePipe
  ],
  templateUrl: './home-owner.html',
  styleUrl: './home-owner.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeOwner {
  private iamStore = inject(IamStore);
  private router = inject(Router);

  /**
   * Gets the current session user account.
   */
  readonly sessionUserAccount = computed(() => this.iamStore.sessionUserAccount());

  /**
   * Handles the click event for the start button.
   */
  onStartClick(): void {
    const currentUserAccount = this.sessionUserAccount();

    if (!currentUserAccount) {
      console.warn('⚠️ No user account in session');
      return;
    }

    // Update is_new flag to false
    const updatedUserAccount = new UserAccount({
      id: currentUserAccount.id,
      username: currentUserAccount.username,
      email: currentUserAccount.email,
      user_id: currentUserAccount.user_id,
      role_id: currentUserAccount.role_id,
      membership_id: currentUserAccount.membership_id,
      password: currentUserAccount.password, // Keep existing password
      is_new: false, // Mark as not new anymore
    });

    console.log('📤 Updating user account to mark as not new:', {
      id: updatedUserAccount.id,
      username: updatedUserAccount.username,
      is_new: updatedUserAccount.is_new
    });

    this.iamStore.updateUserAccount(updatedUserAccount);

    // Navigate to dashboard
    this.router.navigate(['/layout-owner/dashboard-owner']).then(() => {
      console.log('✅ Navigated to dashboard-owner');
    });
  }
}
