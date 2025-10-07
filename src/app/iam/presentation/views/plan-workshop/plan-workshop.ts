import {Component, inject} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {IamStore} from '@iam/application/iam-store';

@Component({
  selector: 'app-plan-workshop',
  imports: [TranslateModule],
  templateUrl: './plan-workshop.html',
  styleUrl: './plan-workshop.css'
})
export class PlanWorkshop {
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
