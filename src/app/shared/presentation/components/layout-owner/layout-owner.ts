import { Component } from '@angular/core';
import { SideBarOwner } from '@shared/presentation/components/side-bar-owner/side-bar-owner';
import {LanguageSwitcher} from '@shared/presentation/components/language-switcher/language-switcher';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-layout-owner',
  imports: [SideBarOwner, LanguageSwitcher, RouterOutlet],
  templateUrl: './layout-owner.html',
  styleUrl: './layout-owner.css'
})
export class LayoutOwner {

}
