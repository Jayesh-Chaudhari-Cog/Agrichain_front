import { Component, signal, inject, Renderer2 } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WebNameElement } from "../../elements/web-name";

@Component({
	selector: 'app-login',
	imports: [RouterLink, WebNameElement],
	templateUrl: './login.html',
	styleUrl: './login.css'
})
export class LoginPage {
	protected readonly title = signal('Agrichain');

	private renderer = inject(Renderer2);
	account_method = signal("login");
	role_selected = signal("FARMER");

	onAccountMethodChange(newMethod: string) {
		this.account_method.set(newMethod);

		this.onRoleChange("FARMER")
	}

	onRoleChange(newRole: string) {
		this.role_selected.set(newRole);

		const roles = ['FARMER', 'TRADER', 'OFFICER'];
        roles.forEach(role => {
            this.renderer.removeClass(document.body, role.toLowerCase());
        });

        this.renderer.addClass(document.body, newRole.toLowerCase());

		localStorage.setItem('theme-role', newRole);
	}
}