import { Component, signal } from '@angular/core';

@Component({
	selector: 'admin-home',
	templateUrl: './admin-home.html',
	styleUrl: './admin-home.css'
})
export class AdminHome {
	readonly totalReports = signal(428);
	readonly pendingReviews = signal(32);
	readonly totalNotifications = signal(18);
	readonly transactionSuccess = signal(86);

	readonly metrics = signal([
		{ label: 'Report coverage', value: 72 },
		{ label: 'Audit readiness', value: 55 },
		{ label: 'Pending approvals', value: 38 },
		{ label: 'Transaction closure', value: 90 },
	]);
}

