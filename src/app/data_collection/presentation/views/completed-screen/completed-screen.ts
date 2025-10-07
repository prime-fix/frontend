import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';


@Component({
  selector: 'app-completed-screen',
  imports: [
    MatButton

  ],
  templateUrl: './completed-screen.html',
  styleUrl: './completed-screen.css'
})
export class CompletedScreen {
  private location = inject(Location);
  private router=inject(Router)
  private route=inject(ActivatedRoute);

  goBack() {
    this.router.navigate(['home']).then();
  }
}
