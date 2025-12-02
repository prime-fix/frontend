import {Component, computed, inject} from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";
import {IamStore} from '@iam/application/iam-store';
import {Router} from '@angular/router';
import {UserAccount} from '@iam/domain/model/user-account.entity';

@Component({
  selector: 'app-home-workshop',
    imports: [
        TranslatePipe
    ],
  templateUrl: './home-workshop.html',
  styleUrl: './home-workshop.css'
})
export class HomeWorkshop {
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
    this.router.navigate(['/layout-workshop/dashboard-workshop']).then();
  }
}
