import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PublicLayout} from '@shared/presentation/views/public-layout/public-layout';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PublicLayout],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
