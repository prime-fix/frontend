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
    if (!this.sessionUserAccount()) {
      return;
    }
    const updatedUserAccount = new UserAccount({
      id: this.sessionUserAccount()?.id!,
      username: this.sessionUserAccount()?.username!,
      email: this.sessionUserAccount()?.email!,
      user_id: this.sessionUserAccount()?.user_id!,
      role_id: this.sessionUserAccount()?.role_id!,
      membership_id: this.sessionUserAccount()?.membership_id!,
      password: this.sessionUserAccount()?.password!,
      is_new: false,
    })
    this.iamStore.updateUserAccount(updatedUserAccount);
    this.router.navigate(['/layout-owner/dashboard-owner']).then();
  }
}
