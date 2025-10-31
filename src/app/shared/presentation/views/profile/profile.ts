import {Component, signal, ChangeDetectionStrategy, inject, computed} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IamStore} from '@iam/application/iam-store';
import {CatalogStore} from '@catalog/application/catalog-store';
import {Location} from '@catalog/domain/model/location.entity';
import {UserAccount} from '@iam/domain/model/user-account.entity';

@Component({
  selector: 'app-profile',
  imports: [TranslateModule, CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Profile {
  /**
   * Stores
   * @private
   */
  private iamStore = inject(IamStore);
  private catalogStore = inject(CatalogStore);

  /**
   * Computed properties for session data
   */
  sessionUserAccount = computed(() => this.iamStore.sessionUserAccount());
  sessionUser = computed(() => this.iamStore.sessionUser());
  sessionLocation = computed(() =>
    this.catalogStore.getLocationById(this.sessionUser()?.id_location)());

  /**
   * Profile fields
   */
  profileImage = signal<string | undefined>('');
  usernameToEdit = signal<string | undefined>('');
  addressToEdit = signal<string | undefined>('');
  passwordToEdit = signal<string | undefined>('');

  /**
   * UI State
   */
  isEditMode = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  /**
   * Constructor
   */
  constructor() {
    this.usernameToEdit.set(this.sessionUserAccount()?.username);
    this.addressToEdit.set(this.sessionLocation()?.address);
    this.passwordToEdit.set(this.sessionUserAccount()?.password);

    // Temporal profile image based on role
    // TODO: Replace with actual user profile image
    this.isOwner() ? this.profileImage.set('assets/images/car_owner.png')
      : this.profileImage.set('assets/images/manager_workshop.png');
  }

  /**
   * Check if the user is an owner
   */
  isOwner(): boolean {
    return this.sessionUserAccount()?.id_role === 'R001';
  }

  /**
   * UI Actions
   */
  toggleEditMode(): void {
    this.isEditMode.set(!this.isEditMode());
  }

  /**
   * Toggle password visibility
   */
  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  /**
   * Save changes made to the profile
   */
  saveChanges(): void {
    const locationEdit = new Location({
      id_location: this.sessionLocation()?.id!,
      address: this.addressToEdit()!,
      district: this.sessionLocation()?.district!,
      department: this.sessionLocation()?.department!
    });
    const updatedUserAccount = new UserAccount({
      id_user_account: this.sessionUserAccount()?.id!,
      username: this.usernameToEdit()!,
      email: this.sessionUserAccount()?.email!,
      id_user: this.sessionUserAccount()?.id_user!,
      id_role: this.sessionUserAccount()?.id_role!,
      id_membership: this.sessionUserAccount()?.id_membership!,
      password: this.passwordToEdit()!,
      is_new: this.sessionUserAccount()?.is_new!,
    });

    this.iamStore.updateLocation(locationEdit);
    this.iamStore.updateUserAccount(updatedUserAccount);
    this.isEditMode.set(false);
  }

  /**
   * Handle image change
   * @param event
   */
  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profileImage.set(e.target?.result as string);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}

