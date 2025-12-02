import {Component, ChangeDetectionStrategy, input, inject, computed} from '@angular/core';
import { AutoRepair } from '@catalog/domain/model/auto-repair.entity';
import { Location } from '@catalog/domain/model/location.entity';
import { Router } from '@angular/router';
import {IamStore} from '@iam/application/iam-store';
import {UserAccount} from '@iam/domain/model/user-account.entity';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-select-auto-repair',
  imports: [
    TranslatePipe
  ],
  templateUrl: './select-auto-repair.html',
  styleUrl: './select-auto-repair.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectAutoRepair {
  readonly autoRepair = input.required<AutoRepair>();
  readonly location = input<Location | undefined>();
  private readonly iamStore = inject(IamStore);
  private router = inject(Router);

  readonly userAccount = computed(() => {
    const idUserAccount = this.autoRepair()?.user_account_id;
    return idUserAccount ? this.iamStore.getUserAccountById(idUserAccount)() : undefined;
  })

  readonly userAccountName = computed(() => this.userAccount()?.username ?? '')

  onSelect(): void {
    const autoRepairId = this.autoRepair().id;
    // Navigate to schedule visit page
    this.router.navigate(['layout-owner/data-collection/new-visit', autoRepairId]).then();
  }
}
