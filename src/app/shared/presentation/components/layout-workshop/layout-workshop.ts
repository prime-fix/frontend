import { Component } from '@angular/core';
import { SideBarWorkshop } from '@shared/presentation/components/side-bar-workshop/side-bar-workshop';
import {RouterOutlet} from '@angular/router';
import {LanguageSwitcher} from '@shared/presentation/components/language-switcher/language-switcher';

@Component({
  selector: 'app-layout-workshop',
  imports: [SideBarWorkshop, RouterOutlet, LanguageSwitcher],
  templateUrl: './layout-workshop.html',
  styleUrl: './layout-workshop.css'
})
export class LayoutWorkshop {

}
