import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LayoutOwner} from '@shared/presentation/views/layout-owner/layout-owner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutOwner],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
