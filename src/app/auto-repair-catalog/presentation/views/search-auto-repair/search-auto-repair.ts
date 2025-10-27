import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {CatalogStore} from '@catalog/application/catalog-store';
import {SelectAutoRepair} from '@catalog/presentation/components/select-auto-repair/select-auto-repair';
import {CommonModule} from '@angular/common';
import {IamStore} from '@iam/application/iam-store';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-search-auto-repair',
  imports: [ReactiveFormsModule, SelectAutoRepair, CommonModule, TranslatePipe],
  templateUrl: './search-auto-repair.html',
  styleUrl: './search-auto-repair.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchAutoRepair {
  private fb = inject(FormBuilder);
  private catalogStore = inject(CatalogStore);
  private iamStore = inject(IamStore);

  readonly showResults = signal(false);
  private selectedDepartmentSignal = signal<string>('');

  readonly loading = this.catalogStore.loading;
  readonly error = this.catalogStore.error;

  readonly searchForm = this.fb.group({
    department: ['', Validators.required],
    district: ['', Validators.required]
  });

  constructor() {
    // Watch for changes in the department field
    this.searchForm.get('department')?.valueChanges.subscribe(value => {
      this.selectedDepartmentSignal.set(value || '');
      // Reset district when department changes
      this.searchForm.get('district')?.setValue('');
    });
  }

  readonly filteredAutoRepairs = computed(() => {
    const autoRepairs = this.catalogStore.autoRepairs();
    const locations = this.catalogStore.locations();
    const userAccounts = this.iamStore.userAccounts();
    const users = this.iamStore.users();
    const formValue = this.searchForm.value;

    if (!this.showResults() || !formValue.department || !formValue.district) {
      return [];
    }

    // Filter locations based on selected department and district
    const matchingLocations = locations.filter(
      loc => loc.department === formValue.department && loc.district === formValue.district
    );

    const matchingLocationIds = new Set(matchingLocations.map(loc => loc.id));

    // Create a map for faster lookup
    return autoRepairs
      .map(autoRepair => {
        // Get the user_account associated with the auto_repair
        const userAccount = userAccounts.find(ua => ua.id === autoRepair.id_user_account);
        if (!userAccount) return null;

        // Get the user associated with the user_account
        const user = users.find(u => u.id === userAccount.id_user);
        if (!user) return null;

        // Get the location associated with the user
        const location = locations.find(loc => loc.id === user.id_location);
        if (!location) return null;

        // Verify if the location matches the selected department and district
        if (!matchingLocationIds.has(location.id)) return null;

        return {
          autoRepair,
          location
        };
      })
      .filter(item => item !== null);
  });

  readonly departments = computed(() => {
    const locations = this.catalogStore.locations();
    const departmentsFromLocations = [...new Set(locations.map(loc => loc.department))];

    // Values by default
    const defaultDepartments = ['Lima'];

    // Combine default values with those from the backend
    const allDepartments = [...new Set([...defaultDepartments, ...departmentsFromLocations])];

    return allDepartments.sort();
  });

  readonly districts = computed(() => {
    const locations = this.catalogStore.locations();
    const selectedDepartment = this.selectedDepartmentSignal();

    if (!selectedDepartment) return [];

    // Values by default for Lima
    const defaultLimaDistricts = [
      'San Miguel',
      'Miraflores',
      'San Isidro',
      'Surco',
      'La Molina',
      'Barranco',
      'Pueblo Libre',
      'Jesús María',
      'Lince',
      'Los Olivos',
      'Cercado de Lima',
      'Santiago de Surco',
      'Surquillo'
    ];

    const districtsFromLocations = [...new Set(
      locations
        .filter(loc => loc.department === selectedDepartment)
        .map(loc => loc.district)
    )];

    // If the selected department is Lima, combine default districts with those from the backend
    if (selectedDepartment === 'Lima') {
      const allDistricts = [...new Set([...defaultLimaDistricts, ...districtsFromLocations])];
      return allDistricts.sort();
    }

    // For other departments, return only districts from the backend
    return districtsFromLocations.sort();
  });

  onSearch(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    this.showResults.set(true);
  }

  onBack(): void {
    this.showResults.set(false);
    this.searchForm.reset();
  }
}
