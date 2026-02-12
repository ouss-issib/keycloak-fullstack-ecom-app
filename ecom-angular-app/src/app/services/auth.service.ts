import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface AuthResponse {
  authenticated: boolean;
  authorities: any[];
  credentials: {
    tokenValue: string;
    issuedAt: string;
    expiresAt: string;
  };
  principal: {
    claims: {
      name: string;
      email: string;
      preferred_username: string;
      given_name: string;
      family_name: string;
    };
  };
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  scope: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/api/auth';
  private keycloakTokenUrl = 'http://localhost:8080/realms/ecom-realm/protocol/openid-connect/token';
  private clientId = 'ecom-client-app';
  private clientSecret = 'YOUR_CLIENT_SECRET'; // Should be from environment

  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  public accessToken$ = this.accessTokenSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
  }

  /**
   * Get auth info from backend
   */
  getAuthInfo(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(this.apiUrl).pipe(
      tap(response => {
        if (response.authenticated) {
          this.accessTokenSubject.next(response.credentials.tokenValue);
          this.isAuthenticatedSubject.next(true);

          const user: User = {
            id: response.principal.claims.preferred_username,
            name: response.principal.claims.name,
            email: response.principal.claims.email,
            username: response.principal.claims.preferred_username,
            roles: response.authorities.map(a => a.authority)
          };
          this.userSubject.next(user);
          this.saveToLocalStorage(response.credentials.tokenValue);
        }
      })
    );
  }

  /**
   * Login with username and password
   */
  login(username: string, password: string): Observable<TokenResponse> {
    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', this.clientId);
    body.set('username', username);
    body.set('password', password);
    body.set('scope', 'email profile');

    return this.http.post<TokenResponse>(this.keycloakTokenUrl, body.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).pipe(
      tap(response => {
        this.accessTokenSubject.next(response.access_token);
        this.isAuthenticatedSubject.next(true);
        this.saveToLocalStorage(response.access_token);
        this.fetchUserInfo();
      })
    );
  }

  /**
   * Logout
   */
  logout(): void {
    this.accessTokenSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.userSubject.next(null);
    localStorage.removeItem('access_token');
  }

  /**
   * Refresh access token using refresh token
   */
  refreshToken(refreshToken: string): Observable<TokenResponse> {
    const body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('client_id', this.clientId);
    body.set('refresh_token', refreshToken);

    return this.http.post<TokenResponse>(this.keycloakTokenUrl, body.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).pipe(
      tap(response => {
        this.accessTokenSubject.next(response.access_token);
        this.saveToLocalStorage(response.access_token);
      })
    );
  }

  /**
   * Fetch user info after login
   */
  private fetchUserInfo(): void {
    this.getAuthInfo().subscribe({
      error: (err) => console.error('Failed to fetch user info:', err)
    });
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    return this.accessTokenSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Get current user
   */
  getUser(): User | null {
    return this.userSubject.value;
  }

  /**
   * Save token to localStorage
   */
  private saveToLocalStorage(token: string): void {
    localStorage.setItem('access_token', token);
  }

  /**
   * Load token from localStorage on app init
   */
  private loadFromLocalStorage(): void {
    const token = localStorage.getItem('access_token');
    if (token) {
      this.accessTokenSubject.next(token);
      this.isAuthenticatedSubject.next(true);
      this.fetchUserInfo();
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() > exp;
    } catch {
      return true;
    }
  }
}
