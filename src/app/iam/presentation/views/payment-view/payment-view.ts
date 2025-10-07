import {Component, inject, signal, ChangeDetectionStrategy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {IamStore} from '@iam/application/iam-store';
import {AmountDetails, PlanDetails} from '@iam/domain/types/membership-choice.type';

@Component({
  selector: 'app-payment',
  imports: [ReactiveFormsModule, TranslateModule, CommonModule],
  templateUrl: './payment-view.html',
  styleUrl: './payment-view.css',
})
export class PaymentView{
  private fb = inject(FormBuilder);
  private store = inject(IamStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isProcessing = signal(false);
  planInfo = this.store.registerMemberShipType;

  months = [
    { value: 1, name: 'Enero' },
    { value: 2, name: 'Febrero' },
    { value: 3, name: 'Marzo' },
    { value: 4, name: 'Abril' },
    { value: 5, name: 'Mayo' },
    { value: 6, name: 'Junio' },
    { value: 7, name: 'Julio' },
    { value: 8, name: 'Agosto' },
    { value: 9, name: 'Septiembre' },
    { value: 10, name: 'Octubre' },
    { value: 11, name: 'Noviembre' },
    { value: 12, name: 'Diciembre' }
  ];
  years = Array.from({length: 10}, (_, i) => new Date().getFullYear() + i);
  documentTypes = ['DNI', 'Pasaporte', 'Carné de Extranjería'];
  document_number_value = this.store.registerUser()?.dni;
  planSelected: string;
  AmountSelected: string;

  paymentForm = this.fb.group({
    card_number: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required] }),
    month: new FormControl<number>(1, { nonNullable: true, validators: [Validators.required] }),
    year: new FormControl<number>(new Date().getFullYear(), { nonNullable: true, validators: [Validators.required] }),
    cvv: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required] }),
    card_type: new FormControl<string>('Visa', { nonNullable: true, validators: [Validators.required] }),
    document_number: new FormControl<string>(this.document_number_value || '', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
  });

  constructor() {
    const planId = this.planInfo();
    if(planId === "M001") {
      this.planSelected = PlanDetails.M001;
      this.AmountSelected = AmountDetails.M001;
    } else if(planId === "M002") {
      this.planSelected = PlanDetails.M002;
      this.AmountSelected = AmountDetails.M002;
    } else {
      this.planSelected = PlanDetails.M003;
      this.AmountSelected = AmountDetails.M003;
    }
  }

  onSubmit() {
    if (this.paymentForm.invalid || this.isProcessing()) {
      this.paymentForm.markAllAsTouched();
      return;
    }
    this.isProcessing.set(true);

    const formData = this.paymentForm.getRawValue();

    this.store.finishRegister(formData);
    this.store.resetRegistrationFlow();

    this.router.navigateByUrl('/login').then();
  }
}
