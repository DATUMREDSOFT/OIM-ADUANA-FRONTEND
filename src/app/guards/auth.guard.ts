import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const storedUserType = localStorage.getItem('tipo-usuario');
    let userType;

    try {
      const parsedUserType = JSON.parse(storedUserType || '{}');
      userType = parsedUserType?.value?.value || parsedUserType?.value;
    } catch (error) {
      this.router.navigate(['/authentication/boxed-register']);
      return false;
    }

    const requiredRole = route.data['role'];

    if (!userType) {
      this.router.navigate(['/authentication/boxed-register']);
      return false;
    }

    if (requiredRole && userType !== requiredRole) {
      const redirectTo =
        userType === 'NOAFPA'
          ? '/dashboards/dashboard-externo'
          : userType === 'AFPA'
          ? '/dashboards/dashboard-afpa'
          : userType === 'INTERNO'
          ? '/dashboards/dashboard-interno'
          : '/authentication/boxed-register';

      this.router.navigateByUrl(redirectTo);
      return false;
    }

    return true;
  }
}
