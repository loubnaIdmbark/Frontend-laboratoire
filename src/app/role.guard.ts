import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './services/login.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRole = route.data['role']; // Récupère le rôle requis
    const userRole = this.authService.getUserRoles();

    if (userRole === requiredRole) {
      return true;
    }

    // Redirige si l'utilisateur n'a pas le rôle requis
    this.router.navigate(['/not-authorized']);
    return false;
  }
}
