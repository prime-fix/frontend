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
    // TODO: Implementar lógica para guardar el plan seleccionado y redirigir
    // Por ahora, redirigir al layout del taller
    void this.router.navigateByUrl('/layout-workshop');
  }
}
