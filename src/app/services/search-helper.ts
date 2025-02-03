import { AuthHelperService } from './auth-helper.service';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

export function searchUser(
    documentNumber: string,
    authHelperService: AuthHelperService
  ): Observable<any> {
    return authHelperService.validateElaborador(documentNumber).pipe(
      catchError(() => authHelperService.validateAplicante(documentNumber)),
      catchError(() => authHelperService.validateAgenteAFPA(documentNumber)),
      catchError(() => authHelperService.validatePersonalNoAFPA(documentNumber)),
      catchError(() => {
        // Return null if no user is found
        return of(null);
      })
    );
  }