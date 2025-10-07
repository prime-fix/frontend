import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {IamStore} from '@iam/application/iam-store';
import {Router} from '@angular/router';

@Component({
  selector: 'button-logout',
  imports: [TranslateModule],
  templateUrl: './button-logout.html',
  styleUrl: './button-logout.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonLogout {
  private readonly store = inject(IamStore);
  private readonly router = inject(Router);

  onLogout(): void {
    this.store.logout();
    void this.router.navigateByUrl('/login');
  }
}
