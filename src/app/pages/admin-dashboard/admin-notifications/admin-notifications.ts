import { Component } from '@angular/core';

@Component({
	selector: 'admin-notifications',
	templateUrl: './admin-notifications.html',
	styleUrl: './admin-notifications.css'
})
export class AdminNotifications {
	readonly notifications = [
		{ id: 1, category: 'System', status: 'New', message: 'New admin audit notification created.', date: 'Today' },
		{ id: 2, category: 'Report', status: 'Unread', message: 'Report approval required for Q2 data.', date: 'Yesterday' },
		{ id: 3, category: 'Transaction', status: 'Sent', message: 'Transaction review completed.', date: '2 days ago' }
	];
}

