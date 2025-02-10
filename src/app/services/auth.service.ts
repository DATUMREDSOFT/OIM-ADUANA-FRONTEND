import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './base.service';
import { environments } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {
  private urlApi = environments.urlApi;

  constructor(protected override http: HttpClient) {
    super(http);
  }

  validatePersonalNoAFPA(document: string): Observable<any> {
    const url = `${this.urlApi}/form/request/applicant/PersonalNoAFPA/${document}`;
    return this.http.get(url);
  }

  validateAgenteAFPA(document: string): Observable<any> {
    const url = `${this.urlApi}/form/request/applicant/AgenteAFPA/${document}`;
    return this.http.get(url);
  }

  validateElaborador(document: string): Observable<any> {
    const url = `${this.urlApi}/form/request/applicant/Elaborador/${document}`;
    return this.http.get(url);
  }

  validateAplicante(document: string): Observable<any> {
    const url = `${this.urlApi}/form/request/applicant/Aplicante/${document}`;
    return this.http.get(url);
  }

  validateDocument(document: string): Observable<any> {
    const url = `${this.urlApi}/form/user/valid/${document}`;
    return this.get(url);
  }

  login(credentials: { user: string; password: string; role: string | null }): Observable<any> {
    const url = `${environments.urlApi}dga/flow/login`;
    credentials.role = null; // Ensure role is always null
    return this.http.post(url, credentials, { responseType: 'text' }).pipe(
      map((response: any) => {
        try {
          return JSON.parse(response);
        } catch (e) {
          return response;
        }
      })
    );
  }

  register(user: any): Observable<any> {
    const url = `${environments.urlApi}/auth/register`;
    return this.post(url, user);
  }
}