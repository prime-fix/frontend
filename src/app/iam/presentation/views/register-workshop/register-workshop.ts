import {Component, inject, signal, ChangeDetectionStrategy, effect} from '@angular/core';
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {IamStore} from '@iam/application/iam-store';
import {CommonModule} from '@angular/common';
import {CatalogStore} from '@catalog/application/catalog-store';
import {Location} from '@catalog/domain/model/location.entity';
import {User} from '@iam/domain/model/user.entity';
import {UserAccount} from '@iam/domain/model/user-account.entity';

@Component({
  selector: 'app-register-workshop',
  imports: [CommonModule,
    ReactiveFormsModule,
    TranslateModule],
  templateUrl: './register-workshop.html',
  styleUrl: './register-workshop.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterWorkshop {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  readonly iamStore = inject(IamStore);
  private catalogStore = inject(CatalogStore);

  isPasswordVisible = signal(false);

  registerForm = this.fb.group({
    name_workshop: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.minLength(3)]}),
    username: new FormControl('',{ nonNullable: true, validators: [Validators.required, Validators.minLength(3)]}),
    ruc: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{11}$/)] }),
    phone_number: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    department: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    district: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    address: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
  });

  private _autoRedirect = effect(() => {
    // Check if registration data is saved (not authenticated yet, just data collected)
    const user = this.iamStore.registerUser();
    const userAccount = this.iamStore.registerUserAccount();

    if (user && userAccount) {
      const target = '/plan-workshop';
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
    console.log('📝 Register workshop form data (saving to signals):', formData);

    // Save registration data to signals (NO POST yet, just in memory)
    this.iamStore.saveRegisterWorkshop(formData);

    // Auto-redirect to plan-workshop will be handled by _autoRedirect effect
  }

  navigateToLogin() {
    void this.router.navigateByUrl('/login');
  }

  navigateToPlanWorkshop() {
    void this.router.navigateByUrl('/plan-workshop');
  }

  /**
   * Fallback registration for auto repair using Supabase
   * Creates entities in FK order: Location → User → UserAccount
   * @param formData - The form data from the registration process
   */
  registerAutoRepairFallbackSupabase(formData: {
    name_workshop: string;
    username: string;
    ruc: string;
    phone_number: string;
    department: string;
    district: string;
    address: string;
    email: string;
    password: string;
  }): void {
    console.log('📤 Registering auto repair with Supabase (fallback)...');

    // Step 1: Create Location
    const newLocation = new Location({
      id: 0,
      department: formData.department,
      district: formData.district,
      address: formData.address
    });

    console.log('📤 Creating Location (Supabase):', newLocation);
    this.catalogStore.addLocation(newLocation);

    // Wait for location creation, then create user
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
        name: formData.name_workshop,
        last_name: '',
        dni: formData.ruc,
        phone_number: formData.phone_number,
        location_id: createdLocation.id
      });

      console.log('📤 Creating User (Supabase):', newUser);
      this.iamStore.addUser(newUser);

      // Wait for user creation, then create user account
      setTimeout(() => {
        const createdUser = this.iamStore.users().find(u =>
          u.dni === formData.ruc &&
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
          role_id: 2, // Auto Repair role
          membership_id: 0,
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
          console.log('✅ Auto repair registration successful (Supabase fallback)');

          // The rest is handled by IamStore (session, navigation, etc.)
        }, 500);
      }, 500);
    }, 500);
  }
}
