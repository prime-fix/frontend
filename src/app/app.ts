import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LayoutOwner} from '@shared/presentation/views/layout-owner/layout-owner';
import {LayoutWorkshop} from '@shared/presentation/views/layout-workshop/layout-workshop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutWorkshop],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
