import { Component, signal } from '@angular/core';
import {LoginOwner} from '@iam/presentation/views/login-owner/login-owner';
import {LayoutOwner} from '@shared/presentation/views/layout-owner/layout-owner';

@Component({
  selector: 'app-root',
  imports: [ LayoutOwner],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
