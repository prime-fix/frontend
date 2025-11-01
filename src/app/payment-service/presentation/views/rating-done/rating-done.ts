import { Component, inject } from '@angular/core';
import {Router} from '@angular/router'
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-rating-done',
  imports: [TranslatePipe],
  templateUrl: './rating-done.html',
  styleUrl: './rating-done.css'
})
export class RatingDone {
  protected router = inject(Router)

  goBack(){
    this.router.navigate(['layout-owner/dashboard-owner']).then()
  }
}
