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
    console.log('Raw Local Storage Value:', storedUserType);
    let userType;

    try {
      const parsedUserType = JSON.parse(storedUserType || '{}');
      userType = parsedUserType?.value?.value || parsedUserType?.value;
    } catch (error) {
      console.error('Error parsing user type from localStorage:', error);
      this.router.navigate(['/authentication/boxed-register']);
      return false;
    }

    console.log('Parsed User Type:', userType);
    
    // Get the required role from the route data
    const requiredRole = route.data['role'];
    console.log('Required Role for Route:', requiredRole);

    if (!userType) {
      console.warn('No user type found, redirecting to login');
      this.router.navigate(['/authentication/boxed-register']);
      return false;
    }

    if (requiredRole && userType !== requiredRole) {
      console.warn(`Access Denied: User type "${userType}" does not match required role "${requiredRole}"`);

      // Redirect unauthorized users to their appropriate dashboard
      const redirectTo =
        userType === 'NOAFPA'
          ? '/dashboards/dashboard-externo'
          : userType === 'AFPA'
          ? '/dashboards/dashboard-afpa'
          : userType === 'INTERNO'
          ? '/dashboards/dashboard-interno'
          : '/authentication/boxed-register'; // Default fallback

      console.log('Redirecting to:', redirectTo);
      this.router.navigateByUrl(redirectTo);
      return false;
    }

    console.log('Access Granted');
    return true;
  }
}
