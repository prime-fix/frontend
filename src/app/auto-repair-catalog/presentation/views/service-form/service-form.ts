import {Component, computed, inject, signal} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CatalogStore} from '@catalog/application/catalog-store';
import {Service} from '@catalog/domain/model/service.entity';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-service-form',
  imports: [
    TranslatePipe,
    ReactiveFormsModule
  ],
  templateUrl: './service-form.html',
  styleUrl: './service-form.css'
})
export class ServiceForm {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private catalogStore = inject(CatalogStore);
  private translate = inject(TranslateService);

  isLoading = this.catalogStore.loading;

  // Signals de estado
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  readonly allServices = this.catalogStore.services;

  protected selectedServiceId = signal<string | number | null>(null);

  protected recentlyCreatedService = signal<Service | null>(null);

  protected isFilteringByRecent = signal<boolean>(true);


  readonly displayedServices = computed(() => {
    if (this.isFilteringByRecent()) {
      const newService = this.recentlyCreatedService();
      return newService ? [newService] : [];
    }
    return this.allServices();
  });

  readonly servicesWithOffers = computed(() =>
    this.catalogStore.serviceOffers().map(offer => offer.service_id)
  );

  readonly availableServices = computed(() =>
    this.allServices().filter(service =>
      !this.hasOffer(service.id)
    )
  );

  serviceForm = this.fb.group({
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    description: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(250)] })
  });

  constructor() {}

  hasOffer(serviceId: string | number): boolean {
    return this.servicesWithOffers().includes(String(serviceId));
  }

  onCreateService(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      this.errorMessage.set(this.translate.instant('manage-services.create-form-error'));
      return;
    }

    const formValue = this.serviceForm.getRawValue();
    const currentServices = this.allServices();

    const maxId = currentServices.reduce((max, service) => {
      const match = String(service.id).match(/\d+/);
      const idNum = match ? Number(match[0]) : 0;
      return idNum > max ? idNum : max;
    }, 0);

    const newIdPrefix = 'S';
    const newServiceId = newIdPrefix + String(maxId + 1).padStart(3, '0');

    const newService = new Service({
      id_service: newServiceId,
      name: formValue.name,
      description: formValue.description,
    });

    this.catalogStore.addService(newService);

    this.recentlyCreatedService.set(newService);
    this.isFilteringByRecent.set(true);

    this.serviceForm.reset();
    this.successMessage.set(this.translate.instant('manage-services.service-created-success'));
    setTimeout(() => this.successMessage.set(null), 3000);
  }

  onConfigureOffer(serviceId: string | number): void {
    if (this.isLoading()) return;

    this.router.navigate(['/layout-workshop/auto-repair-catalog/offer-form', String(serviceId)]);
  }

  onDeleteService(serviceId: string | number): void {
    if (this.isLoading()) return;

    const confirmation = confirm(this.translate.instant('manage-services.confirm-delete'));

    if (confirmation) {
      this.catalogStore.deleteService(String(serviceId));
      this.selectedServiceId.set(null);

      if (this.recentlyCreatedService()?.id === serviceId) {
        this.recentlyCreatedService.set(null);
      }

      this.successMessage.set(this.translate.instant('manage-services.service-deleted-success'));
      setTimeout(() => this.successMessage.set(null), 3000);
    }
  }

  onToggleServiceView() {
    if (this.isFilteringByRecent()) {
      this.isFilteringByRecent.set(false);
      this.recentlyCreatedService.set(null);
    } else {
      this.isFilteringByRecent.set(true);
    }
  }

  onBackToWorkshop() {
    this.router.navigate(['/layout-workshop/auto-repair-register/manage-auto-repair']);
  }
}
