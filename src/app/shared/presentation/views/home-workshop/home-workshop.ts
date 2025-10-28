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
      id_user_account: this.sessionUserAccount()?._id_user_account!,
      username: this.sessionUserAccount()?._username!,
      email: this.sessionUserAccount()?._email!,
      id_user: this.sessionUserAccount()?._id_user!,
      id_role: this.sessionUserAccount()?._id_role!,
      id_membership: this.sessionUserAccount()?._id_membership!,
      password: this.sessionUserAccount()?._password!,
      is_new: false,
    })
    this.iamStore.updateUserAccount(updatedUserAccount);
    this.router.navigate(['/layout-workshop/dashboard-workshop']).then();
  }
}
