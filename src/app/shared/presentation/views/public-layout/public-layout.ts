import { Component } from '@angular/core';
import {LoginOwner} from '@iam/presentation/views/login-owner/login-owner';
import {LanguageSwitcher} from '@shared/presentation/components/language-switcher/language-switcher';

@Component({
  selector: 'app-public-layout',
  imports: [LoginOwner, LanguageSwitcher],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css'
})
export class PublicLayout {

}
