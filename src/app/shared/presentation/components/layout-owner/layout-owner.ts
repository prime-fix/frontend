import { Component } from '@angular/core';
import { SideBarOwner } from '@shared/presentation/components/side-bar-owner/side-bar-owner';
import {LanguageSwitcher} from '@shared/presentation/components/language-switcher/language-switcher';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-layout-owner',
  imports: [SideBarOwner, RouterOutlet],
  templateUrl: './layout-owner.html',
  styleUrl: './layout-owner.css'
})
export class LayoutOwner {
  options = [
    {link: '/home-owner', label: 'option.home'},
    {link: '/maintenance-tracking/track-vehicle', label: 'option.categories'},
  ];
}
