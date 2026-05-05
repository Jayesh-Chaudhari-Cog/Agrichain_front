import { Component, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Loader } from '../../../common-components/loader/loader';

@Component({
	selector: 'admin-notificaitons',
	imports: [RouterLink, Loader],
	templateUrl: './admin-notifications.html',
	styleUrl: './admin-notifications.css'
})
export class AdminNotifications {
	
}
