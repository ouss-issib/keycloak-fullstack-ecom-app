import { KeycloakService } from 'keycloak-angular';
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private keycloak: KeycloakService) {}

  async canActivate(): Promise<boolean> {
    const loggedIn = await this.keycloak.isLoggedIn();
    if (!loggedIn) {
      await this.keycloak.login();
      return false;
    }
    return true;
  }
}
