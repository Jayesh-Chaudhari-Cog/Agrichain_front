import { Component, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
	selector: 'app-admin',
	imports: [RouterLink],
	templateUrl: './admin.html',
	styleUrl: './admin.css'
})
export class AdminPage {
	protected readonly title = signal('Agrichain');

}
