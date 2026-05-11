import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../../services/report.service';
import { NotificationService } from '../../../services/notification.service';
import { UserService } from '../../../services/user-service';
import { CropListingStatus, UserRole } from '../../../models/enum.model';
import { MarketService } from '../../../services/market';
import Chart from 'chart.js/auto';

@Component({
	selector: 'admin-home',
	imports: [CommonModule],
	templateUrl: './admin-home.html',
	styleUrl: './admin-home.css'
})
export class AdminHome implements OnInit {

	readonly totalReports = signal(0);
	readonly totalNotifications = signal(0);
	chart: any;

	readonly totalUsers = signal(0);
	totalPercent = computed(() => 100 / this.totalUsers());
	readonly totalFarmers = signal(0);
	readonly totalTraders = signal(0);
	readonly totalOfficers = signal(0);
	readonly totalManagers = signal(0);
	readonly totalCompliance = signal(0);
	readonly totalAuditors = signal(0);
	readonly totalAdmins = signal(0);

	readonly colors = {
		farmer: 'var(--farmer-green)',
		trader: 'var(--trader-blue)',
		compliance: '#00ced1',
		auditor: '#00ffff',
		officer: '#abeeee',
		manager: '#abffff',
		admin: 'var(--admin-purple)'
	};
	readonly chartGradient = computed(() => {
		const total = this.totalUsers();
		if (total === 0) return 'lightgray';

		const p = (val: number) => (val / total) * 100;

		const s1 = p(this.totalFarmers());
		const s2 = s1 + p(this.totalTraders());
		const s3 = s2 + p(this.totalCompliance());
		const s4 = s3 + p(this.totalAuditors());
		const s5 = s4 + p(this.totalOfficers());
		const s6 = s5 + p(this.totalManagers());

		return `conic-gradient(
		${this.colors.farmer} 0% ${s1}%,
		${this.colors.trader} ${s1}% ${s2}%,
		${this.colors.compliance} ${s2}% ${s3}%,
		${this.colors.auditor} ${s3}% ${s4}%,
		${this.colors.officer} ${s4}% ${s5}%,
		${this.colors.manager} ${s5}% ${s6}%,
		${this.colors.admin} ${s6}% 100%
  		)`;
	});

	constructor(
		private reportService: ReportService,
		private notificationService: NotificationService,
		private userService: UserService,
		private marketService: MarketService
	) { }

	ngOnInit(): void {
		this.fetchData();

	}

	fetchData() {
		this.reportService.getAllReports().subscribe(reports => {
			this.totalReports.set(reports.length);
		});

		this.notificationService.getAllNotifications().subscribe(notifications => {
			const broadcasts = notifications.filter(n => n.userId == null);
			this.totalNotifications.set(broadcasts.length);
		});

		this.userService.getAllUsers().subscribe(users => {
			this.totalUsers.set(users.length);
			const counts = {
				[UserRole.FARMER]: 0,
				[UserRole.TRADER]: 0,
				[UserRole.OFFICER]: 0,
				[UserRole.MANAGER]: 0,
				[UserRole.COMPLIANCE]: 0,
				[UserRole.AUDITOR]: 0,
				[UserRole.ADMIN]: 0
			};

			users.forEach(user => {
				if (counts[user.role] !== undefined) {
					counts[user.role]++;
				}
			});

			this.totalFarmers.set(counts[UserRole.FARMER]);
			this.totalTraders.set(counts[UserRole.TRADER]);
			this.totalOfficers.set(counts[UserRole.OFFICER]);
			this.totalManagers.set(counts[UserRole.MANAGER]);
			this.totalCompliance.set(counts[UserRole.COMPLIANCE]);
			this.totalAuditors.set(counts[UserRole.AUDITOR]);
			this.totalAdmins.set(counts[UserRole.ADMIN]);
		});

		this.marketService.getListingsByStatus(CropListingStatus.VALIDATED).subscribe(listings => {
			this.createChart(listings);
		});
	}

	createChart(data: any[]) {
		// 1. Process data: Count occurrences of each crop name
		const counts: { [key: string]: number } = {};
		data.forEach(item => {
			counts[item.cropName] = (counts[item.cropName] || 0) + 1;
		});

		const labels = Object.keys(counts);
		const values = Object.values(counts);

		// 2. Initialize Chart.js
		this.chart = new Chart('CropChart', {
			type: 'bar', // or 'pie', 'doughnut'
			data: {
				labels: labels,
				datasets: [{
					label: 'Number of Listings',
					data: values,
					backgroundColor: ['#4CAF50', '#FF9800', '#2196F3', '#9C27B0', '#F44336'],
					borderWidth: 1
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { display: false }
				}
			}
		});
	}
}
