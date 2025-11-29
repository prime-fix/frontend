import { Component } from '@angular/core';
import { SideBarOwner } from '@shared/presentation/components/side-bar-owner/side-bar-owner';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-layout-owner',
  imports: [SideBarOwner, RouterOutlet],
  templateUrl: './layout-owner.html',
  styleUrl: './layout-owner.css'
})
export class LayoutOwner {

}
