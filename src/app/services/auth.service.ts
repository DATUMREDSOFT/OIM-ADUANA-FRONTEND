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

  validatePersonalNoAFPA(document: string): Observable<any> {
    const url = `${this.apiUrl}/form/request/applicant/PersonalNoAFPA/${document}`;
    return this.http.get(url);
  }

  validateAgenteAFPA(document: string): Observable<any> {
    const url = `${this.apiUrl}/form/request/applicant/AgenteAFPA/${document}`;
    return this.http.get(url);
  }

  validateElaborador(document: string): Observable<any> {
    const url = `${this.apiUrl}/form/request/applicant/Elaborador/${document}`;
    return this.http.get(url);
  }

  validateAplicante(document: string): Observable<any> {
    const url = `${this.apiUrl}/form/request/applicant/Aplicante/${document}`;
    return this.http.get(url);
  }

  validateDocument(document: string): Observable<any> {
    const url = `${this.apiUrl}/form/user/valid/${document}`;
    return this.get(url);
  }

  login(credentials: { user: string; password: string; role: string | null }): Observable<any> {
    const url = `${environment.apiUrl}/flow/login`;
    credentials.role = null; // Ensure role is always null
    return this.post(url, credentials);
  }

  register(user: any): Observable<any> {
    const url = `${environment.apiUrl}/auth/register`;
    return this.post(url, user);
  }
}