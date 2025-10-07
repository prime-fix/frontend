import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

interface ProgressStep {
  id: number;
  label: string;
  translationKey: string;
}

@Component({
  selector: 'app-progress-bar',
  imports: [TranslateModule, CommonModule],
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.css'
})
export class ProgressBar {
  currentVehicle = input<string | undefined>("Vehicle not identified");
  // Input para recibir el estado actual desde el componente padre
  currentStep = input<number>(1);

  // Definir los pasos del progreso basándose en el mockup
  steps: ProgressStep[] = [
    { id: 1, label: 'En espera', translationKey: 'progress-bar.waiting' },
    { id: 2, label: 'En diagnóstico', translationKey: 'progress-bar.diagnosis' },
    { id: 3, label: 'En reparación', translationKey: 'progress-bar.repair' },
    { id: 4, label: 'En prueba', translationKey: 'progress-bar.testing' },
    { id: 5, label: 'Listo para recoger', translationKey: 'progress-bar.readyPickup' },
    { id: 6, label: 'Recogido', translationKey: 'progress-bar.collected' }
  ];

  /**
   * Determina si un paso está completado
   */
  isStepCompleted(stepId: number): boolean {
    return stepId < this.currentStep();
  }

  /**
   * Determina si un paso es el actual
   */
  isCurrentStep(stepId: number): boolean {
    return stepId === this.currentStep();
  }

  /**
   * Determina si un paso está pendiente
   */
  isStepPending(stepId: number): boolean {
    return stepId > this.currentStep();
  }
}
