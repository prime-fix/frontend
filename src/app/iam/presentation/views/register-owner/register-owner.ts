import {Component, inject, signal, ChangeDetectionStrategy, effect} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {IamStore} from '@iam/application/iam-store';
import {CatalogStore} from '@catalog/application/catalog-store';
import {Location} from '@catalog/domain/model/location.entity';
import {User} from '@iam/domain/model/user.entity';
import {UserAccount} from '@iam/domain/model/user-account.entity';

@Component({
  selector: 'app-register-owner',
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './register-owner.html',
  styleUrl: './register-owner.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterOwner {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  readonly iamStore = inject(IamStore);
  private catalogStore = inject(CatalogStore);

  isPasswordVisible = signal(false);

  constructor() {
    this.iamStore.startRegistrationFlow('Vehicle Owner');
  }

  registerForm = this.fb.group({
    fullName: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.minLength(3)]}),
    username: new FormControl<string>('', {nonNullable: true, validators: [Validators.required, Validators.minLength(3)]}),
    dni: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    phone_number: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    department: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    district: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    address: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] })
  });

  private _autoRedirect = effect(() => {
    // Check if registration data is saved (not authenticated yet, just data collected)
    const user = this.iamStore.registerUser();
    const userAccount = this.iamStore.registerUserAccount();

    if (user && userAccount) {
      const target = '/plan-owner';
      if (this.router.url !== target) {
        console.log('✅ Registration data saved, navigating to plan selection');
        void this.router.navigateByUrl(target);
      }
    }
  });

  togglePasswordVisibility() {
    this.isPasswordVisible.update(visible => !visible);
  }

  onSubmit() {
    if (this.registerForm.invalid || this.iamStore.loading()) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formData = this.registerForm.getRawValue();
    console.log('📝 Register owner form data (saving to signals):', formData);

    // Save registration data to signals (NO POST yet, just in memory)
    this.iamStore.saveRegisterOwner(formData);

    // Auto-redirect to plan-owner will be handled by _autoRedirect effect
  }

  navigateToLogin() {
    void this.router.navigateByUrl('/login');
  }

  navigateToPlanOwner() {
    void this.router.navigateByUrl('/plan-owner');
  }

  /**
   * Fallback registration for vehicle owner using Supabase
   * This is called from finishRegister() when AWS is not available
   * Creates all entities in FK order: Location → User → UserAccount
   * @param formData - The form data from the registration process
   */
  registerVehicleOwnerFallbackSupabase(formData: {
    fullName: string;
    username: string;
    dni: string;
    phone_number: string;
    department: string;
    district: string;
    address: string;
    email: string;
    password: string;
  }): void {
    console.log('📤 Registering vehicle owner with Supabase (fallback)...');

    // Split fullName into name and lastName
    const nameParts = formData.fullName.trim().split(' ');
    const name = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ');

    // Get payment and membership data from registration signals
    const membershipId = this.iamStore.registerMemberShipType();

    // Step 1: Create Location
    const newLocation = new Location({
      id: 0,
      department: formData.department,
      district: formData.district,
      address: formData.address
    });

    console.log('📤 Creating Location (Supabase):', newLocation);
    this.catalogStore.addLocation(newLocation);

    // Wait for location creation
    setTimeout(() => {
      const createdLocation = this.catalogStore.locations().find(l =>
        l.department === formData.department &&
        l.district === formData.district &&
        l.address === formData.address
      );

      if (!createdLocation) {
        console.error('❌ Failed to create location');
        return;
      }

      console.log('✅ Location created:', createdLocation);

      // Step 2: Create User
      const newUser = new User({
        id: 0,
        name: name,
        last_name: lastName,
        dni: formData.dni,
        phone_number: formData.phone_number,
        location_id: createdLocation.id
      });

      console.log('📤 Creating User (Supabase):', newUser);
      this.iamStore.addUser(newUser);

      // Wait for user creation
      setTimeout(() => {
        const createdUser = this.iamStore.users().find(u =>
          u.dni === formData.dni &&
          u.location_id === createdLocation.id
        );

        if (!createdUser) {
          console.error('❌ Failed to create user');
          return;
        }

        console.log('✅ User created:', createdUser);

        // Step 3: Create UserAccount
        const newUserAccount = new UserAccount({
          id: 0,
          username: formData.username.trim(),
          email: formData.email.trim(),
          user_id: createdUser.id,
          role_id: 1, // Vehicle Owner
          membership_id: membershipId || 1,
          password: formData.password,
          is_new: true
        });

        console.log('📤 Creating UserAccount (Supabase):', newUserAccount);
        this.iamStore.addUserAccount(newUserAccount);

        // Wait for user account creation
        setTimeout(() => {
          const createdUserAccount = this.iamStore.userAccounts().find(ua =>
            ua.username === formData.username.trim()
          );

          if (!createdUserAccount) {
            console.error('❌ Failed to create user account');
            return;
          }

          console.log('✅ UserAccount created:', createdUserAccount);
          console.log('✅ Vehicle owner registration successful (Supabase fallback)');

          // The rest is handled by IamStore (session, navigation, etc.)
        }, 500);
      }, 500);
    }, 500);
  }
}
