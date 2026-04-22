import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private jwtHelper = new JwtHelperService();
  
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'agrichain_token';

  // Signals for easy UI updates
  userEmail = signal<string | null>(null);
  userRole = signal<string | null>(null);

  login(credentials: any) {
    return this.http.post<{token: string}>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        this.saveToken(response.token);
        this.decodeAndStore(response.token);
      })
    );
  }

  private saveToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private decodeAndStore(token: string) {
    const decoded = this.jwtHelper.decodeToken(token);
    this.userEmail.set(decoded.email);
    this.userRole.set(decoded.role);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    // Returns true if token exists and is NOT expired
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.userEmail.set(null);
    this.userRole.set(null);
    this.router.navigate(['/login']);
  }
}