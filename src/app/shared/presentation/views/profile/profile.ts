import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [TranslateModule, CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Profile {
  // Profile data signals
  profileImage = signal<string>('/assets/images/car_owner.png');
  username = signal<string>('Luis_123');
  address = signal<string>('Av. Universitaria 630');
  password = signal<string>('************');

  // UI state
  isEditMode = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  /**
   * Determines if the current user is an owner or workshop
   * TODO: Implement the logic to detect user type
   * You can inject your auth service here and check the user role
   * @returns {boolean} true if user is owner, false if workshop
   */
  isOwner(): boolean {
    // TODO: Add your logic here
    // Example: return this.authService.getUserRole() === 'OWNER';
    return true; // Default to owner for now
  }

  toggleEditMode(): void {
    this.isEditMode.set(!this.isEditMode());
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  saveChanges(): void {
    // TODO: Implement save logic
    console.log('Saving profile changes...', {
      username: this.username(),
      address: this.address(),
      password: this.password()
    });
    this.isEditMode.set(false);
  }

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

