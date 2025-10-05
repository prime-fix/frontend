import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  get<T = unknown>(key: string): T | null {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }
  set<T = unknown>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
