import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { WorkshopCatalogStore } from '../../../application/workshop-catalog-store';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-workshop-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    TranslatePipe
  ],
  templateUrl: './workshop-search.component.html',
  styleUrls: ['./workshop-search.component.css']
})
export class WorkshopSearchComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private store = inject(WorkshopCatalogStore);

  public departments = this.store.getUniqueDepartments();
  public districts = this.store.getUniqueDistricts();

  public searchForm = this.fb.group({
    department: new FormControl<string>('Lima', {nonNullable: true, validators: [Validators.required]}),
    district: new FormControl<string>('', {nonNullable: true, validators: [Validators.required]})
  });

  searchWorkshops() {
    if (this.searchForm.invalid) return;
    const district = this.searchForm.value.district!;
    this.router.navigate
  }
}
