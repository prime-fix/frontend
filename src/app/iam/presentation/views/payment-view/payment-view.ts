import {Component, inject, signal, ChangeDetectionStrategy, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';

interface PlanInfo {
  type: string;
  name: string;
  amount: string;
}

@Component({
  selector: 'app-payment',
  imports: [ReactiveFormsModule, TranslateModule, CommonModule],
  templateUrl: './payment-view.html',
  styleUrl: './payment-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentView implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isProcessing = signal(false);
  planInfo = signal<PlanInfo>({type: '3-months', name: '3 meses', amount: 'S/.59'});

  months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  years = Array.from({length: 10}, (_, i) => new Date().getFullYear() + i);
  documentTypes = ['DNI', 'Pasaporte', 'Carné de Extranjería'];

  paymentForm = this.fb.group({
    cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
    month: ['', Validators.required],
    year: ['', Validators.required],
    cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]],
    documentType: ['DNI', Validators.required],
    documentNumber: ['', [Validators.required, Validators.minLength(8)]]
  });

  ngOnInit() {
    // Obtener información del plan desde los parámetros de ruta
    this.route.queryParams.subscribe(params => {
      const planType = params['plan'] || '3-months';
      this.updatePlanInfo(planType);
    });
  }

  private updatePlanInfo(planType: string) {
    const plans: Record<string, PlanInfo> = {
      '3-months': {type: '3-months', name: '3 meses', amount: 'S/.59'},
      '12-months': {type: '12-months', name: '12 meses', amount: 'S/.219'},
      '1-month': {type: '1-month', name: '1 mes', amount: 'S/.19'}
    };
    this.planInfo.set(plans[planType] || plans['3-months']);
  }

  onSubmit() {
    if (this.paymentForm.invalid || this.isProcessing()) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.isProcessing.set(true);

    // Simular procesamiento de pago
    setTimeout(() => {
      console.log('Pago procesado:', this.paymentForm.value);
      this.isProcessing.set(false);
      // Redirigir al layout después del pago exitoso
      void this.router.navigateByUrl('/layout-owner');
    }, 2000);
  }

  formatCardNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    this.paymentForm.patchValue({cardNumber: value});
  }

  formatCVV(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 3) value = value.slice(0, 3);
    this.paymentForm.patchValue({cvv: value});
  }

  formatDocumentNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '');
    this.paymentForm.patchValue({documentNumber: value});
  }
}
