import {Component, computed, effect, inject, signal, untracked} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CatalogStore} from '@catalog/application/catalog-store';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {Service} from '@catalog/domain/model/service.entity';
import {ServiceOffer} from '@catalog/domain/model/service-offer.entity';
import {IamStore} from '@iam/application/iam-store';

@Component({
  selector: 'app-service-offers-form',
  imports: [
    TranslatePipe,
    ReactiveFormsModule
  ],
  templateUrl: './service-offers-form.html',
  styleUrl: './service-offers-form.css'
})
export class ServiceOffersForm {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private catalogStore = inject(CatalogStore);
  private translate = inject(TranslateService);
  private iamStore = inject(IamStore);

  serviceId: string | null = null;

  readonly sessionAutoRepairLinkageId = this.iamStore.sessionUserAccountId;

  readonly autoRepairId = computed(() => {
    const linkageId = this.sessionAutoRepairLinkageId();
    return this.catalogStore.getAutoRepairIdByUserId(linkageId)();
  });

  currentService = signal<Service | undefined>(undefined);
  isLoading = this.catalogStore.loading;
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  offerForm: FormGroup = this.fb.group({
    price: new FormControl<number | null>(null, {
      nonNullable: false,
      validators: [Validators.required, Validators.min(0.01), Validators.max(99999.99)]
    }),
    duration: new FormControl<number | null>(null, {
      nonNullable: false,
      validators: [Validators.required, Validators.min(1), Validators.max(24)]
    }),
  });

  constructor() {
    effect(() => {
      const autoRepairIdValue = this.autoRepairId();
      const currentServiceId = this.serviceId;

      if (autoRepairIdValue && currentServiceId) {
        this.catalogStore.loadServiceOffers(autoRepairIdValue);
        this.errorMessage.set(null);
      } else if (this.iamStore.sessionUserAccount() && !autoRepairIdValue && !this.iamStore.loading()) {
        this.errorMessage.set(this.translate.instant('service-offer.no-auto-repair-associated-error'));
      }
    });

    effect(() => {
      const loading = this.isLoading();
      const error = this.catalogStore.error();

      if (!loading) {
        if (error) {
          this.errorMessage.set(error);
          this.successMessage.set(null);
        } else if (this.successMessage()) {
          untracked(() => {
            setTimeout(() => this.onBackToServiceList(), 1500);
          });
        }
      }
    });
  }


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.serviceId = id;

    if (this.serviceId) {
      this.currentService.set(this.catalogStore.getServiceById(this.serviceId)());

      if (!this.currentService()) {
        this.errorMessage.set(this.translate.instant('service-offer.service-not-found'));
      }
    } else {
      this.onBackToServiceList();
    }
  }

  onCreateOrUpdateOffer(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const currentAutoRepairId = this.autoRepairId();

    if (this.offerForm.invalid || !this.serviceId || !currentAutoRepairId) {
      this.offerForm.markAllAsTouched();
      let msg = this.translate.instant('service-offer.form-validation-error');

      if (!currentAutoRepairId) {
        msg = this.translate.instant('service-offer.no-auto-repair-associated-error');
      }
      this.errorMessage.set(msg);
      this.successMessage.set(null);
      return;
    }

    const formValue = this.offerForm.getRawValue();

    const serviceOffer: any = {
      id_service: String(this.serviceId),
      id_auto_repair: String(currentAutoRepairId),
      price: Number(formValue.price!),
      duration_hour: Number(formValue.duration!),
      is_active: true,
    };

    this.successMessage.set(this.translate.instant('service-offer.save-success'));
    this.catalogStore.addServiceOffer(currentAutoRepairId, serviceOffer);
  }


  onBackToServiceList(): void {
    this.router.navigate(['/layout-workshop/auto-repair-catalog/service-form']);
  }
}
