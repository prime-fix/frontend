import {AuthToken} from '@shared/domain/auth-token';
import {inject, Injectable, signal} from '@angular/core';
import {AUTH_STORAGE_KEY} from '@shared/infrastructure/http/tokens/AUTH_STORAGE_KEY.token';

export interface SessionSnapshot  {
  user?: {
    id: string | number;
    email?: string;
    fullName?: string;
    roles?: string;
  };
  token?: AuthToken | null;
}

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private storageKey = inject(AUTH_STORAGE_KEY);
  private state = signal<SessionSnapshot>({ token: null });

  readonly snapshot = this.state.asReadonly();

  load() {
    const raw = localStorage.getItem(this.storageKey);
    if (raw) this.state.set(JSON.parse(raw) as SessionSnapshot);
  }

  saveUserAndToken(user: SessionSnapshot['user'], token: AuthToken) {
    const snap = { user, token };
    this.state.set(snap);
    localStorage.setItem(this.storageKey, JSON.stringify(snap));
  }

  clear() {
    this.state.set({ token: null });
    localStorage.removeItem(this.storageKey);
  }
}
