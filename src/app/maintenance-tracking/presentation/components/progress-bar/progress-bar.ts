import {Component, inject, input} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import {ProgressStep} from '@tracking/domain/interfaces/progress-step.interface';
import {Router} from '@angular/router';


@Component({
  selector: 'app-progress-bar',
  imports: [TranslateModule, CommonModule],
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.css'
})
export class ProgressBar {
  private router = inject(Router);
  // Input to receive the current step from parent component
  currentStep = input<number>(1);

  // Definition of progress steps
  steps: ProgressStep[] = [
    { id: 1, label: 'En espera', translationKey: 'progress-bar.waiting' },
    { id: 2, label: 'En diagnóstico', translationKey: 'progress-bar.diagnosis' },
    { id: 3, label: 'En reparación', translationKey: 'progress-bar.repair' },
    { id: 4, label: 'En prueba', translationKey: 'progress-bar.testing' },
    { id: 5, label: 'Listo para recoger', translationKey: 'progress-bar.readyPickup' },
    { id: 6, label: 'Recogido', translationKey: 'progress-bar.collected' }
  ];

  /**
   * Determine if a step is completed
   */
  isStepCompleted(stepId: number): boolean {
    return stepId < this.currentStep();
  }

  /**
   * Determine if a step is the current step
   */
  isCurrentStep(stepId: number): boolean {
    return stepId === this.currentStep();
  }

  /**
   * Determine if a step is pending
   */
  isStepPending(stepId: number): boolean {
    return stepId > this.currentStep();
  }

  goPayment(): void {
    this.router.navigate(['layout-owner/payment-service/payment']).then();
  }
}
