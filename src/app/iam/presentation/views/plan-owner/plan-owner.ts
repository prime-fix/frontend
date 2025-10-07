import {Component, inject, ChangeDetectionStrategy} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {IamStore} from '@iam/application/iam-store';

@Component({
  selector: 'app-plan-owner',
  imports: [TranslateModule],
  templateUrl: './plan-owner.html',
  styleUrl: './plan-owner.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanOwner {
  private router = inject(Router);
  private store = inject(IamStore);

  selectPlan(planType: "1m" | "3m" | "12m") {
    console.log('Plan seleccionado:', planType);
    this.store.selectPlan(planType);
    this.goToPayment();
  }

  goToPayment() {
    this.router.navigate(['/payment-view']).then();
  }
}
