import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  isAuthenticated$!: Observable<boolean>;
  user$!: Observable<User | null>;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Initialize observables in ngOnInit
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.user$ = this.authService.user$;
    
    // Load auth info on component init
    this.authService.getAuthInfo().subscribe({
      error: (err) => console.log('Not authenticated yet')
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
