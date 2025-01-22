import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userTypeSubject = new BehaviorSubject<string>('externo'); // Default to 'externo'
  userType$: Observable<string> = this.userTypeSubject.asObservable();

  setUserType(userType: string) {
    this.userTypeSubject.next(userType);
  }

  getUserType(): string {
    return this.userTypeSubject.value;
  }
}