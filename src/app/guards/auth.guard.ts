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
    const userType = JSON.parse(localStorage.getItem('tipo-usuario') || '{}')?.value;

    // Get the required role from the route data
    const requiredRole = route.data['role'];

    if (userType === requiredRole) {
      // Allow access if the user has the required role
      return true;
    } else {
      // Redirect unauthorized users to their appropriate dashboard
      const redirectTo =
        userType === 'NOAFPA'
          ? '/dashboards/dashboard-externo'
          : userType === 'AFPA'
          ? '/dashboards/dashboard-interno'
          : '/authentication/boxed-register'; // Default fallback

      this.router.navigate([redirectTo]);
      return false;
    }
  }
}
