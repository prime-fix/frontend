import {Component, inject} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-plan-workshop',
  imports: [TranslateModule],
  templateUrl: './plan-workshop.html',
  styleUrl: './plan-workshop.css'
})
export class PlanWorkshop {
  private router = inject(Router);

  selectPlan(planType: string) {
    console.log('Plan seleccionado:', planType);
    // Redirigir a la página de pago con el parámetro del plan
    void this.router.navigate(['/payment'], { queryParams: { plan: planType } });
  }
}
