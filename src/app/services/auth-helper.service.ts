import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthHelperService {
  constructor(private authService: AuthService) {}

  validateElaborador(documentNumber: string): Observable<any> {
    return this.authService.validateElaborador(documentNumber);
  }

  validateAplicante(documentNumber: string): Observable<any> {
    return this.authService.validateAplicante(documentNumber);
  }

  validateAgenteAFPA(documentNumber: string): Observable<any> {
    return this.authService.validateAgenteAFPA(documentNumber);
  }

  validatePersonalNoAFPA(documentNumber: string): Observable<any> {
    return this.authService.validatePersonalNoAFPA(documentNumber);
  }
}