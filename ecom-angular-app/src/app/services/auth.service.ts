import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';

export interface AuthState {
  initialized: boolean;
  authenticated: boolean;
  username: string | null;
  roles: string[];
  token: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private state$ = new BehaviorSubject<AuthState>({
    initialized: false,
    authenticated: false,
    username: null,
    roles: [],
    token: null
  });

  constructor(private keycloak: KeycloakService) {}

  // 🔁 call this once after APP_INITIALIZER finishes
  async loadState(): Promise<void> {
    const authenticated = await this.keycloak.isLoggedIn();
    const profile = authenticated ? await this.keycloak.loadUserProfile() : null;
    const token = authenticated ? await this.keycloak.getToken() : null;
    const roles = authenticated ? this.keycloak.getUserRoles(true) : [];

    this.state$.next({
      initialized: true,
      authenticated,
      username: profile?.firstName + " " + profile?.lastName || null,
      roles,
      token
    });
  }

  // 📡 observable for components
  get auth$() {
    return this.state$.asObservable();
  }

  // ⚡ sync snapshot
  get snapshot(): AuthState {
    return this.state$.value;
  }

  // 🔐 basic actions
  login(redirectUri?: string) {
    return this.keycloak.login({
      redirectUri: redirectUri || window.location.origin
    });
  }

  logout() {
    return this.keycloak.logout(window.location.origin);
  }

  register() {
    return this.keycloak.register();
  }

  account() {
    return this.keycloak.getKeycloakInstance().accountManagement();
  }

  // 🪪 token helpers
  async getToken(): Promise<string | null> {
    try {
      const token = await this.keycloak.getToken();
      this.patch({ token });
      return token;
    } catch {
      return null;
    }
  }

  async refreshToken(minValidity = 30): Promise<boolean> {
    try {
      const refreshed = await this.keycloak.updateToken(minValidity);
      const token = await this.keycloak.getToken();
      this.patch({ token });
      return refreshed;
    } catch {
      this.patch({ authenticated: false, token: null });
      return false;
    }
  }

  // 🧠 state helpers
  isAuthenticated(): boolean {
    return this.snapshot.authenticated;
  }

  hasRole(role: string): boolean {
    return this.snapshot.roles.includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some(r => this.snapshot.roles.includes(r));
  }

  getUsername(): string | null {
    return this.snapshot.username;
  }

  getRoles(): string[] {
    return this.snapshot.roles;
  }

  // 🧩 internal patch
  private patch(partial: Partial<AuthState>) {
    this.state$.next({ ...this.state$.value, ...partial });
  }
}
