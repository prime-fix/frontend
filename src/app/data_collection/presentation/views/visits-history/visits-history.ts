import { Component } from '@angular/core';
import {VisitList} from "@collections/presentation/components/visit-list/visit-list";

@Component({
  selector: 'app-visits-history',
    imports: [
        VisitList
    ],
  templateUrl: './visits-history.html',
  styleUrl: './visits-history.css'
})
export class VisitsHistory {

}
