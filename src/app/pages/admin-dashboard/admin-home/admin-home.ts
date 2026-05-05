import { Component, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Loader } from '../../../common-components/loader/loader';

@Component({
	selector: 'admin-home',
	imports: [RouterLink, Loader],
	templateUrl: './admin-home.html',
	styleUrl: './admin-home.css'
})
export class AdminHome {
	
}
