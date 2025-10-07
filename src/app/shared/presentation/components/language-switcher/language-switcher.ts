import {Component, inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-language-switcher',
  imports: [CommonModule],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css'
})
export class LanguageSwitcher {
  protected currentLang: string = 'en';

  /** List of available languages with display info */
  protected languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ];

  /** Translation service instance */
  private translate: TranslateService;

  /**
   * Creates an instance of LanguageSwitcherComponent.
   * Initializes the current language from the translation service.
   */
  constructor() {
    this.translate = inject(TranslateService);
    this.currentLang = this.translate.getCurrentLang();
  }

  /**
   * Changes the application's current language.
   * Updates both the translation service and the component's local state.
   *
   * @param language - The language code to switch to (e.g., 'en', 'es')
   */
  useLanguage(language: string) {
    this.translate.use(language);
    this.currentLang = language;
  }
}
