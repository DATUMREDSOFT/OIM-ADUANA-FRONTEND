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
    console.warn(`⚠️ No item found in Local Storage for key: ${key}`);
    return null;
  }

  try {
    console.log(`🔍 Raw Data from Local Storage (${key}):`, item);

    const parsed = JSON.parse(item);
    console.log("✅ Parsed Data:", parsed);

    return parsed; // Return parsed object
  } catch (error) {
    console.error("❌ Error Parsing Local Storage Item:", error);
    return null;
  }
}


  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
