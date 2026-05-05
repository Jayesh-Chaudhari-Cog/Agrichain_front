import { Component, signal } from '@angular/core';

@Component({
	selector: 'admin-reports',
	templateUrl: './admin-reports.html',
	styleUrl: './admin-reports.css'
})
export class AdminReports {
	readonly reports = signal([
		'Q1 Audit summary ready for export',
		'Monthly compliance report generated',
		'Corporate transaction status overview refreshed'
	]);
}

