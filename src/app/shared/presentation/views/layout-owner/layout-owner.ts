import { Component } from '@angular/core';
import { SideBarOwner } from '@shared/presentation/components/side-bar-owner/side-bar-owner';
import {LanguageSwitcher} from '@shared/presentation/components/language-switcher/language-switcher';

@Component({
  selector: 'app-layout-owner',
  imports: [SideBarOwner, LanguageSwitcher],
  templateUrl: './layout-owner.html',
  styleUrl: './layout-owner.css'
})
export class LayoutOwner {

}
