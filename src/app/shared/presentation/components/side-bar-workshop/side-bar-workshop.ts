import { Component } from '@angular/core';
import { ButtonLogout } from '../button-logout/button-logout';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-side-bar-workshop',
  imports: [ButtonLogout, TranslateModule],
  templateUrl: './side-bar-workshop.html',
  styleUrl: './side-bar-workshop.css'
})
export class SideBarWorkshop {

}
