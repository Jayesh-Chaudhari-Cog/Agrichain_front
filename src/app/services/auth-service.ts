import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { LoggedInUser, User } from '../models/user.model';
import { API_URL, TOKEN_KEY, USER_PATH, USER_INFO } from '../elements/constants';
import { ThemeService } from './theme';
import { ToastService } from './toast-service';

@Injectable({ providedIn: 'root' })
export class AuthService {
	private http = inject(HttpClient);
	private router = inject(Router);
	private jwtHelper = new JwtHelperService();
	private themeService = inject(ThemeService);
	private toast = inject(ToastService);

	private _currentUser = signal<User | null>(null);
	readonly currentUser = this._currentUser.asReadonly();

	readonly loggedInUser = computed<LoggedInUser | null>(() => {
		const user = this._currentUser();
		return user ? { email: user.email, role: user.role } : null;
	});

	onLogin(credentials: any) {
		return this.http.post<{ token: string, user?: any }>(`${API_URL}${USER_PATH}/login`, credentials).pipe(
			tap(response => {
				this.saveToken(response.token);
				console.log("token", response.token);
				console.log("user", response.user);
				if (response.user) {
					this._currentUser.set(response.user);
					localStorage.setItem(USER_INFO, JSON.stringify(response.user));
				}
			})
		);
	}

	onRegister(userData: any) {
		return this.http.post(`${API_URL}${USER_PATH}/register`, userData);
	}

	updateUser(userData: any) {
		return this.http.patch(`${API_URL}${USER_PATH}/update/${userData.id}`, userData).pipe(
			tap(() => {
				localStorage.setItem(USER_INFO, JSON.stringify(userData));
				this._currentUser.set(userData);
			})
		);
	}

	private saveToken(token: string) {
		localStorage.setItem(TOKEN_KEY, token);
	}

	private decodeAndStore(token: string) {
		const decoded = this.jwtHelper.decodeToken(token);

	}

	isLoggedIn(): boolean {
		const token = localStorage.getItem(TOKEN_KEY);
		return token ? !this.jwtHelper.isTokenExpired(token) : false;
	}

	logout(shouldRedirect: boolean = true) {
		localStorage.removeItem(TOKEN_KEY);
		localStorage.removeItem(USER_INFO);

		this._currentUser.set(null);

		if(shouldRedirect)
			this.router.navigate(['/login']);
	}
	
	constructor() {
		const token = localStorage.getItem(TOKEN_KEY);
		const savedUserInfo = localStorage.getItem(USER_INFO);
		if (token && savedUserInfo) {
			if(this.jwtHelper.isTokenExpired(token)) {
				this.toast.show('Session Expired! Login again', 'alert')
				this.logout();
			}
			try {
				this._currentUser.set(JSON.parse(savedUserInfo));
				const currentUser = this._currentUser();
				if (currentUser) {
					this.themeService.themeChange(currentUser.role);
				}
			} catch (e) {
				this.logout();
			}
		} else {
			this.logout(false);
		}
	}
}