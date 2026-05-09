import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WebNameElement } from "../../elements/web-name";
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../services/auth-service';
import { getCurrentUser } from '../../elements/constants';
import { User } from '../../models/user.model';
import { faChevronDown, faBell } from '@fortawesome/free-solid-svg-icons';
import { NotificationPop } from '../../pages/notifications/notifications';

@Component({
	selector: 'app-main-header',
	imports: [RouterLink, WebNameElement, FaIconComponent, NotificationPop],
	templateUrl: './main-header.html',
	styleUrl: './main-header.css'
})
export class MainHeader {
	faLogout = faSignOutAlt;
	authService = inject(AuthService);

	faDown = faChevronDown;
	faBell = faBell;

	showNoti = signal(false);

	user: User = getCurrentUser();

	toggleNotifications() {
		if(this.showNoti()) {
			this.hideNotifications();
		} else {
			this.showNotifications();
		}
	}

	showNotifications() {
		this.showNoti.set(true);
	}
	hideNotifications() {
		this.showNoti.set(false);
	}
}
