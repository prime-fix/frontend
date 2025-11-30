import {Component, inject, signal, computed, effect, untracked} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';
import {RegisterStore} from '@register/application/register-store';
import {IamStore} from '@iam/application/iam-store';
import {Router} from '@angular/router';
import {AutoRepair} from '@catalog/domain/model/auto-repair.entity';
import {User} from '@iam/domain/model/user.entity';
import {Location} from '@catalog/domain/model/location.entity';
import {CatalogStore} from '@catalog/application/catalog-store';

@Component({
  selector: 'app-manage-auto-repair',
  imports: [ReactiveFormsModule, TranslateModule, CommonModule],
  templateUrl: './manage-auto-repair.html',
  styleUrl: './manage-auto-repair.css'
})
export class ManageAutoRepair {
  private fb = inject(FormBuilder);
  private registerStore = inject(RegisterStore);
  private iamStore = inject(IamStore);
  private router = inject(Router);
  private catalogStore = inject(CatalogStore);

  /**
   * Signal for loading state
   */
  isLoading = signal(false);

  /**
   * Success and Error Messages
   */
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  /**
   * Session data
   */
  sessionUserAccount = this.iamStore.sessionUserAccount;
  sessionUser = this.iamStore.sessionUser;

  private loaded = false;

  readonly allServices = this.catalogStore.services;
  readonly autoRepairOffers = this.catalogStore.serviceOffers;
  readonly isOffersLoading = this.catalogStore.loading;

  /**
   * Get current auto repair
   */
  currentAutoRepair = computed(() => {
    const userAccountId = this.sessionUserAccount()?.id;
    if (!userAccountId) return undefined;
    return this.registerStore.autoRepairs().find(ar => ar.id_user_account === userAccountId);
  });

  /**
   * Get current location
   */
  currentLocation = computed(() => {
    const user = this.sessionUser();
    if (!user) return undefined;
    return this.iamStore.getLocationById(user.id_location)();
  });

  /**
   * Auto Repair Form
   */
  autoRepairForm = this.fb.group({
    workshopName: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.minLength(3)]}),
    ruc: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{11}$/)]}),
    phoneNumber: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{9}$/)]}),
    department: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    district: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]}),
    address: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.minLength(5)]}),
    email: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.email]})
  });

  /**
   * Constructor for loading initial data
   */
  constructor() {
    this.loadCurrentData();

    effect(() => {
      if (this.loaded) return;

      const autoRepair = this.currentAutoRepair();

      if (!autoRepair?.id) return;

      this.loaded = true;
      this.loadServiceCatalog(autoRepair.id);
    });
  }

  /**
   * Load current data into the form
   */
  private loadCurrentData(): void {
    const user = this.sessionUser();
    const location = this.currentLocation();
    const autoRepair = this.currentAutoRepair();

    if (user && location && autoRepair) {
      this.autoRepairForm.patchValue({
        workshopName: this.sessionUserAccount()?.username,
        ruc: autoRepair.ruc,
        phoneNumber: user.phone_number,
        department: location.department,
        district: location.district,
        address: location.address,
        email: autoRepair.contact_email
      });
    }
  }

  /**
   * Navigate back to dashboard
   */
  onBack(): void {
    this.router.navigate(['/layout-workshop/dashboard-workshop']);
  }

  /**
   * Save changes made in the form
   */
  onSaveChanges(): void {
    if (this.autoRepairForm.invalid) {
      this.autoRepairForm.markAllAsTouched();
      this.errorMessage.set('Please complete all fields correctly.');
      this.successMessage.set(null);
      setTimeout(() => this.errorMessage.set(null), 5000);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const formData = this.autoRepairForm.getRawValue();

    const user = this.sessionUser();
    const location = this.currentLocation();
    const autoRepair = this.currentAutoRepair();

    if (!user || !location || !autoRepair) {
      console.error('Missing required data');
      this.isLoading.set(false);
      this.errorMessage.set('Error: Workshop data could not be found.');
      setTimeout(() => this.errorMessage.set(null), 5000);
      return;
    }

    try {
      // Update User
      const updatedUser = new User({
        id_user: user.id,
        name: formData.workshopName,
        last_name: '',
        dni: formData.ruc,
        phone_number: formData.phoneNumber,
        id_location: location.id
      });
      this.iamStore.updateUser(updatedUser);

      // Update Location
      const updatedLocation = new Location({
        id_location: location.id,
        department: formData.department,
        district: formData.district,
        address: formData.address
      });
      this.iamStore.updateLocation(updatedLocation);

      // Update Auto Repair
      const updatedAutoRepair = new AutoRepair({
        id_auto_repair: autoRepair.id,
        ruc: formData.ruc,
        contact_email: formData.email,
        technicians_count: autoRepair.technicians_count,
        id_user_account: autoRepair.id_user_account
      });
      this.registerStore.updateAutoRepair(updatedAutoRepair);

      setTimeout(() => {
        this.isLoading.set(false);
        this.successMessage.set('Changes saved successfully!');
        setTimeout(() => this.successMessage.set(null), 5000);
      }, 1000);

    } catch (error) {
      console.error('Error updating auto repair data:', error);
      this.isLoading.set(false);
      this.errorMessage.set('Error while saving changes. Please try again.');
      setTimeout(() => this.errorMessage.set(null), 5000);
    }
  }

  private loadServiceCatalog(autoRepairId: number | string): void {
    this.catalogStore.loadServiceOffers(autoRepairId);
  }

  getServiceName(id: string) {
    return this.catalogStore.getServiceById(id)()?.name;
  }

  goToAddService(): void {
    this.router.navigate(['/layout-workshop/auto-repair-catalog/service-form']);
  }

  onDeleteOffer(serviceOfferId: number | string): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const currentAutoRepairId = this.currentAutoRepair()?.id;

    if (!currentAutoRepairId) {
      this.errorMessage.set('Error: Unable to determine workshop ID to delete the offer.');
      return;
    }

    this.catalogStore.deleteServiceOffer(currentAutoRepairId, serviceOfferId);

    setTimeout(() => {
      if (this.catalogStore.error()) {
        this.errorMessage.set(`Failed to delete the offer: ${this.catalogStore.error()}`);
      } else if (!this.catalogStore.loading()) {
        this.successMessage.set('Service offer deleted successfully.');
        setTimeout(() => this.successMessage.set(null), 5000);
      }
    }, 500);
  }
}
