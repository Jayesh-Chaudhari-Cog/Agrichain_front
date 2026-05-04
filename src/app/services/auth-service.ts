import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { LoggedInUser } from '../models/user.model';
import { API_URL, TOKEN_KEY, LOGIN_INFO, USER_PATH } from '../elements/constants';

@Injectable({ providedIn: 'root' })
export class AuthService {
	private http = inject(HttpClient);
	private router = inject(Router);
	private jwtHelper = new JwtHelperService();

	private _loggedInUser = signal<LoggedInUser | null>(null);
	readonly loggedInUser = this._loggedInUser.asReadonly(); // readoinly

	onLogin(credentials: any) {
		return this.http.post<{ token: string }>(`${API_URL}${USER_PATH}`, credentials).pipe(
			tap(response => {
				this.saveToken(response.token);
				this.decodeAndStore(response.token);
			})
		);
	}

	private saveToken(token: string) {
		localStorage.setItem(TOKEN_KEY, token);
	}

	private decodeAndStore(token: string) {
		const decoded = this.jwtHelper.decodeToken(token);

		const loggedIn: LoggedInUser = {
			email: decoded.sub || decoded.email,
			role: decoded.role
		};

		this._loggedInUser.set(loggedIn);

		localStorage.setItem(LOGIN_INFO, JSON.stringify(loggedIn));
	}

	isLoggedIn(): boolean {
		const token = localStorage.getItem(TOKEN_KEY);
		return token ? !this.jwtHelper.isTokenExpired(token) : false;
	}

	logout() {
		localStorage.removeItem(TOKEN_KEY);
		localStorage.removeItem(LOGIN_INFO);

		this._loggedInUser.set(null);

		this.router.navigate(['/login']);
	}

	constructor() {
		const token = localStorage.getItem(TOKEN_KEY);
		const savedUser = localStorage.getItem(LOGIN_INFO);
		if (token && savedUser) {
			if(this.jwtHelper.isTokenExpired(token)) {
				// TODO Expired toast + redirect to login
			}
			try {
				this._loggedInUser.set(JSON.parse(savedUser));
			} catch (e) {
				this.logout();
			}
		} else {
			this.logout();
		}
	}
}