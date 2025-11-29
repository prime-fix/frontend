import { Component } from '@angular/core';
import {VisitList} from '@collections/presentation/components/visit-list/visit-list';

@Component({
  selector: 'app-dashboard-owner',
  imports: [
    VisitList
  ],
  templateUrl: './dashboard-owner.html',
  styleUrl: './dashboard-owner.css'
})
export class DashboardOwner {

}
