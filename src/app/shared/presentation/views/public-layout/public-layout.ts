import { Component } from '@angular/core';
import {LoginOwner} from '@iam/presentation/views/login-owner/login-owner';

@Component({
  selector: 'app-public-layout',
  imports: [LoginOwner],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css'
})
export class PublicLayout {

}
