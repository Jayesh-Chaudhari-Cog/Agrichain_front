import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { LoggedInUser } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private jwtHelper = new JwtHelperService();

    

    loggedInUser = signal<LoggedInUser | null>(null);

    private decodeAndStore(token: string) {
        const decoded = this.jwtHelper.decodeToken(token);
        
        const loggedIn: LoggedInUser = {
            email: decoded.sub || decoded.email,
            role: decoded.role
        };

        this.loggedInUser.set(loggedIn);

        localStorage.setItem(this.LOGIN_INFO, JSON.stringify(loggedIn));
    }

    logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.LOGIN_INFO);
        
        // 4. Reset the signal to null
        this.loggedInUser.set(null);
        
        this.router.navigate(['/login']);
    }

    constructor() {
        const savedUser = localStorage.getItem(this.LOGIN_INFO);
        if (savedUser) {
            try {
                this.loggedInUser.set(JSON.parse(savedUser));
            } catch (e) {
                localStorage.removeItem(this.LOGIN_INFO);
            }
        }
    }
}