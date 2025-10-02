import { Component } from '@angular/core';
import { ButtonLogout } from '../button-logout/button-logout';
import {LanguageSwitcher} from '@shared/presentation/components/language-switcher/language-switcher';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-side-bar-owner',
  imports: [
    ButtonLogout, TranslateModule
  ],
  templateUrl: './side-bar-owner.html',
  styleUrl: './side-bar-owner.css'
})
export class SideBarOwner {

}
