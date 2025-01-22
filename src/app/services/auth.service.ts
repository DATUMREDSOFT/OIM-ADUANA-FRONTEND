import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  private apiUrl = environment.apiUrl;

  constructor(protected override http: HttpClient) {
    super(http);
  }

  validateDocument(document: string): Observable<any> {
    const url = `${this.apiUrl}/form/user/valid/${document}`;
    return this.get(url);
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    const url = `${environment.apiUrl}/auth/login`;
    return this.post(url, credentials);
  }

  register(user: any): Observable<any> {
    const url = `${environment.apiUrl}/auth/register`;
    return this.post(url, user);
  }
}