import {Component, inject, ChangeDetectionStrategy} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-plan-owner',
  imports: [TranslateModule],
  templateUrl: './plan-owner.html',
  styleUrl: './plan-owner.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlanOwner {
  private router = inject(Router);

  selectPlan(planType: string) {
    console.log('Plan seleccionado:', planType);
    // Redirigir a la página de pago con el parámetro del plan
    void this.router.navigate(['/payment'], { queryParams: { plan: planType } });
  }
}
