import { Component, signal } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import { LanguageSwitcher } from '@shared/presentation/components/language-switcher/language-switcher';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LanguageSwitcher],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly userRole = signal('Vehicle Owner');
  title = 'prime-fix';
}
