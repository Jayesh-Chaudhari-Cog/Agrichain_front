import { Component, signal, inject, Renderer2 } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-login',
	imports: [RouterLink],
	templateUrl: './login.html',
	styleUrl: './login.css'
})
export class LoginPage {
	protected readonly title = signal('Agrichain');

	private renderer = inject(Renderer2);
	role_selected = signal("FARMER");

	onRoleChange(newRole: string) {
		this.role_selected.set(newRole);

		const roles = ['FARMER', 'TRADER', 'OFFICER'];
        roles.forEach(role => {
            this.renderer.removeClass(document.body, role.toLowerCase());
        });

        // 3. Add the new role class (e.g., "farmer", "trader")
        this.renderer.addClass(document.body, newRole.toLowerCase());
	}
}