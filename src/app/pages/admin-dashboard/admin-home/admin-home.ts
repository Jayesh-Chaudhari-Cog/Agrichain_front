import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../../services/report.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
	selector: 'admin-home',
	imports: [CommonModule],
	templateUrl: './admin-home.html',
	styleUrl: './admin-home.css'
})
export class AdminHome implements OnInit {
	readonly totalReports = signal(0);
	readonly pendingReviews = signal(0); // Optional placeholder or derived data
	readonly totalNotifications = signal(0);
	readonly transactionSuccess = signal(0); // Optional placeholder or derived data

	readonly metrics = signal([
		{ label: 'Report coverage', value: 0 },
		{ label: 'Audit readiness', value: 0 },
		{ label: 'Pending approvals', value: 0 },
		{ label: 'Transaction closure', value: 0 },
	]);

	constructor(
		private reportService: ReportService,
		private notificationService: NotificationService
	) {}

	ngOnInit(): void {
		this.fetchData();
	}

	fetchData() {
		this.reportService.getAllReports().subscribe(reports => {
			this.totalReports.set(reports.length);
			
			// Simulate some analytics based on reports count
			const coverage = Math.min(100, reports.length * 5); 
			
			const currentMetrics = [...this.metrics()];
			currentMetrics[0].value = coverage;
			this.metrics.set(currentMetrics);
		});

		this.notificationService.getAllNotifications().subscribe(notifications => {
			// Count only broadcast notifications as admin's purview or all notifications
			const broadcasts = notifications.filter(n => n.userId == null);
			this.totalNotifications.set(broadcasts.length);

			const readiness = Math.min(100, broadcasts.length * 10);
			
			const currentMetrics = [...this.metrics()];
			currentMetrics[1].value = readiness;
			this.metrics.set(currentMetrics);
		});
	}
}

