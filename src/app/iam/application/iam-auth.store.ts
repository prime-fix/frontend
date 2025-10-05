import {inject, Injectable} from '@angular/core';
import {AuthApi} from '@iam/infrastructure/api/auth.api';

@Injectable({
  providedIn: 'root',
})
export class IamAuthStore {
  private api = inject(AuthApi);
}
