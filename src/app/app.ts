import { Component, signal } from '@angular/core';
//import {LoginOwner} from '@iam/presentation/views/login-owner/login-owner';
import { LayoutWorkshop } from '@shared/presentation/components/layout-workshop/layout-workshop';

@Component({
  selector: 'app-root',
  //imports: [LoginOwner],
  templateUrl: './app.html',
  imports: [
    LayoutWorkshop
  ],
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('frontend');
}
