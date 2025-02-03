import { HttpClient, HttpHeaders, HttpResponse, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  constructor(protected http: HttpClient) {}

  protected get<T>(url: string, options?: any): Observable<HttpEvent<T>> {
    return this.http.get<T>(url, { ...options, observe: 'events' }).pipe(
      catchError(this.handleError)
    );
  }

  protected post<T>(url: string, body: any, options?: any): Observable<HttpEvent<T>> {
    return this.http.post<T>(url, body, { ...options, observe: 'events' }).pipe(
      catchError(this.handleError)
    );
  }

  protected put<T>(url: string, body: any, options?: any): Observable<HttpEvent<T>> {
    return this.http.put<T>(url, body, { ...options, observe: 'events' }).pipe(
      catchError(this.handleError)
    );
  }

  protected delete<T>(url: string, options?: any): Observable<HttpEvent<T>> {
    return this.http.delete<T>(url, { ...options, observe: 'events' }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError(error);
  }
}