import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  setItem<T>(key: string, value: T, expirationInMinutes: number): void {
    const expirationDate = new Date(
      Date.now() + expirationInMinutes * 60000
    ).toISOString();
    
    const item = { value, expirationDate };
    localStorage.setItem(key, JSON.stringify(item));
  }

  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) {
      return null;
    }

    try {
      const parsed = JSON.parse(item);
      return parsed;
    } catch (error) {
      return null;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
