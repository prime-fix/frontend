import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-visit-alert',
  imports: [TranslatePipe],
  templateUrl: './visit-alert.html',
  styleUrl: './visit-alert.css'
})
export class VisitAlert {
  private router = inject(Router);

  /**
   * Navigate to the dashboard-owner
   */
  goToDashboard(): void {
    this.router.navigate(['/layout-owner/dashboard-owner']).then();
  }
}
