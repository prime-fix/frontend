import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-owner',
  imports: [ReactiveFormsModule, TranslateModule, CommonModule],
  templateUrl: './home-owner.html',
  styleUrl: './home-owner.css'
})
export class HomeOwner {
  private fb = inject(FormBuilder);

  // Arrays de departamentos y distritos para los selects
  departments = [
    'Lima', 'Arequipa', 'Cusco', 'Trujillo', 'Piura', 'Chiclayo', 'Huancayo', 'Tacna'
  ];

  districts = [
    'San Miguel', 'Miraflores', 'San Isidro', 'Barranco', 'Surco', 'La Molina', 'Pueblo Libre', 'Jesús María'
  ];

  searchForm = this.fb.group({
    department: ['', [Validators.required]],
    district: ['', [Validators.required]]
  });

  onSearch() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    const formData = this.searchForm.getRawValue();
    console.log('Búsqueda de taller:', formData);
    // Aquí iría la lógica de búsqueda
  }
}
