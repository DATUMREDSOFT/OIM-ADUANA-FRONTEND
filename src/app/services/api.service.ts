import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, retry, throwError, timeout } from 'rxjs';
import { CargandoService } from './cargando.service';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly cargando = inject(CargandoService);
  private readonly environment = inject(EnvironmentService);
  private readonly urlRaiz = this.environment.urlApi;

  constructor() { }

  request<T>(
    method: string,
    url: string,
    options: {
      headers?: HttpHeaders & any,
      params?: HttpParams,
      body?: any,
      responseType?: 'json'
    } = {}
  ): Observable<T> {
    const urlCompleta = (url.includes('http://') || url.includes('https://')) ? url : this.urlRaiz + url;
    return this.http.request<T>(method, urlCompleta, options).pipe(
      timeout(40000),
      retry(1),
      catchError((error: HttpErrorResponse) => {
        this.cargando.pararCarga();
        return throwError((() => error))
      })
    );
  }
}
