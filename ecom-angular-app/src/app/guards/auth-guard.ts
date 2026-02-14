import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) {
    super(router, keycloak);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {

    // 1. Force the user to log in if they are not authenticated
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url
      });
      return false;
    }

    // 2. Get the roles required for this specific route
    const requiredRoles = route.data['roles'];

    // 3. Allow access if no roles are defined for the route
    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
      return true;
    }

    // 4. Check if the user has AT LEAST ONE of the required roles
    // Use .every() if you strictly require them to have ALL roles
    const hasRequiredRole = requiredRoles.some((role: string) => this.roles.includes(role));

    if (!hasRequiredRole) {
      // Optional: Redirect to an 'unauthorized' page instead of just returning false
      // return this.router.parseUrl('/unauthorized');
      return false;
    }

    return true;
  }
}
