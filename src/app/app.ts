import { Component, signal } from '@angular/core';
import {LoginOwner} from '@iam/presentation/views/login-owner/login-owner';

@Component({
  selector: 'app-root',
  imports: [LoginOwner],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
