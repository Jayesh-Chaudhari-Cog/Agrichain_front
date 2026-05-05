import { Component, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Loader } from '../../common-components/loader/loader';

@Component({
	selector: 'app-admin',
	imports: [RouterLink, Loader],
	templateUrl: './admin.html',
	styleUrl: './admin.css'
})
export class AdminPage {
	protected readonly title = signal('Agrichain');

}
