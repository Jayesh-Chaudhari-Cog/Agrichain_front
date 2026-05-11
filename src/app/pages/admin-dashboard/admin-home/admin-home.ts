import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../../services/report.service';
import { NotificationService } from '../../../services/notification.service';
import { UserService } from '../../../services/user-service';
import { UserRole } from '../../../models/enum.model';

@Component({
	selector: 'admin-home',
	imports: [CommonModule],
	templateUrl: './admin-home.html',
	styleUrl: './admin-home.css'
})
export class AdminHome implements OnInit {

	readonly totalReports = signal(0);
	readonly totalNotifications = signal(0);

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

	readonly totalTransactions = signal(0);
	readonly transactionAmount = signal(0);
	readonly transactionSuccess = signal(0);

	readonly metrics = signal([
		{ label: 'System Coverage', value: 0 },
		{ label: 'Audit Readiness', value: 0 },
		{ label: 'Transaction Health', value: 0 },
		{ label: 'Alert Resolution', value: 0 },
	]);

	constructor(
		private reportService: ReportService,
		private notificationService: NotificationService,
		private userService: UserService
	) { }

	ngOnInit(): void {
		this.fetchData();
	}

	fetchData() {
		this.reportService.getAllReports().subscribe(reports => {
			this.totalReports.set(reports.length);
			const coverage = Math.min(100, Math.round(reports.length * 4.5));
			this.updateMetric(0, coverage);
		});

		this.notificationService.getAllNotifications().subscribe(notifications => {
			const broadcasts = notifications.filter(n => n.userId == null);
			this.totalNotifications.set(broadcasts.length);
			const readiness = Math.min(100, Math.round(broadcasts.length * 8));
			this.updateMetric(1, readiness);

			const readNotifs = broadcasts.filter(n => n.status === 'READ').length;
			const resRate = broadcasts.length > 0 ? Math.round((readNotifs / broadcasts.length) * 100) : 100;
			this.updateMetric(3, resRate);
		});

		this.reportService.getTransactionReport('COMPLETED').subscribe(report => {
			if (report && report.metrics) {
				const numbers = report.metrics.match(/\d+/g);

				if (numbers && numbers.length >= 2) {
					this.totalTransactions.set(parseInt(numbers[0], 10));
					this.transactionAmount.set(parseInt(numbers[1], 10));
				} else if (numbers && numbers.length === 1) {
					this.totalTransactions.set(parseInt(numbers[0], 10));
				}

				// Assuming success rate is high if we have completed transactions
				this.transactionSuccess.set(this.totalTransactions() > 0 ? 95 : 0);
				this.updateMetric(2, this.transactionSuccess());
			}
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
	}

	private updateMetric(index: number, value: number) {
		const currentMetrics = [...this.metrics()];
		currentMetrics[index].value = value;
		this.metrics.set(currentMetrics);
	}
}
