import { AuthService, AuthState } from './../../services/auth.service';
import { KeycloakService } from 'keycloak-angular';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakProfile } from 'keycloak-js';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar implements OnInit {
// We expose the observable directly to the template
  authState$: Observable<AuthState>;

  constructor(private authService: AuthService) {
    this.authState$ = this.authService.auth$;
  }

  ngOnInit(): void {
    // Ensure the state is loaded (if not already handled by APP_INITIALIZER)
    this.authService.loadState();
  }

  handleLogin() {
    this.authService.login();
  }

  handleLogout() {
    this.authService.logout();
  }


}
