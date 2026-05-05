import { Component, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Loader } from '../../../common-components/loader/loader';

@Component({
	selector: 'admin-reports',
	imports: [RouterLink, Loader],
	templateUrl: './admin-reports.html',
	styleUrl: './admin-reports.css'
})
export class AdminReports {
	
}
