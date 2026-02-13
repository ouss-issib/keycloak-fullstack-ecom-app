import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  // Observables exposed to the template
  isAuthenticated$!: Observable<boolean>;
  displayUser$!: Observable<{ name: string | null; email: string | null } | null>;
  // local UI state for dropdown
  showDropdown = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // auth$ emits AuthState { initialized, authenticated, username, roles, token }
    this.isAuthenticated$ = this.authService.auth$.pipe(map(s => s.authenticated));

    // Map to a lightweight user object used by the template
    this.displayUser$ = this.authService.auth$.pipe(
      map(s =>
        s.authenticated
          ? { name: s.username || null, email: null }
          : null
      )
    );

    // If AuthService requires an initial load call, ensure it's done elsewhere (APP_INITIALIZER)
  }

  toggleDropdown(event?: Event) {
    if (event) event.preventDefault();
    this.showDropdown = !this.showDropdown;
  }

  closeDropdown() {
    this.showDropdown = false;
  }

  logout(): void {
    // AuthService.logout delegates to Keycloak when available
    this.authService.logout();
    // Keycloak logout typically handles redirects; if not, navigate home
    try {
      this.router.navigate(['/home']);
    } catch {}
  }
}
