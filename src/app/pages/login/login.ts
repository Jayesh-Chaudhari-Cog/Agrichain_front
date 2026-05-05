import { Component, signal, inject, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { WebNameElement } from "../../elements/web-name";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { ThemeService } from '../../services/theme';
import { LOGIN_INFO } from '../../elements/constants';
import { LoggedInUser } from '../../models/user.model';

@Component({
	selector: 'app-login',
	imports: [RouterLink, WebNameElement, FormsModule],
	templateUrl: './login.html',
	styleUrl: './login.css'
})
export class LoginPage {
	private router = inject(Router);
	private authService = inject(AuthService);
	themeService = inject(ThemeService);

	account_method = signal("login");
	constructor() {
		this.themeService.themeChange("FARMER");
	}
	role_selected = computed(() => this.themeService.themeRole());

	formData = {
		name: '',
		email: '',
		phone: '',
		password: '',
		confirmPassword: ''
	};

	onSubmit() {
		const payload = {
			...this.formData,
			role: this.themeService.role_selected()
		};

		if (this.account_method() === 'login') {
			this.authService.onLogin({
				email: payload.email,
				password: payload.password
			}).subscribe({
				next: () => {
					const loggedUser = this.authService.loggedInUser();
					if(loggedUser) {
						this.themeService.themeChange(loggedUser.role);
					}
					this.router.navigate([`/dashboard/${loggedUser?.role.toLocaleLowerCase()}`]);
				},
				error: (err) => {
					console.error("Login failed", err);
					if (err.status === 409) {
						alert("Incorrect password. Please try again."); // TODO: Toast
					} else if (err.status === 404) {
						alert("User account not found.");
					} else {
						alert("An unexpected error occurred. Please try again later.");
					}
				}
			});
		} else {
			if (this.formData.password !== this.formData.confirmPassword) {
				alert("Passwords do not match!"); // TODO Toast
				return;
			}
			this.authService.onRegister(payload).subscribe({
				next: () => {
					alert("Registration successful! Please login."); // TODO Toast
					this.onAccountMethodChange('login');
				},
				error: (err) => console.error("Signup failed", err)
			});
		}
	}

	onAccountMethodChange(newMethod: string) {
		this.account_method.set(newMethod);
		this.onRoleChange("FARMER");
	}

	onRoleChange(newRole: string) {
		this.themeService.themeChange(newRole);
	}
}