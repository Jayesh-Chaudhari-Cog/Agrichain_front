import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WebNameElement } from "../../elements/web-name";
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../services/auth-service';
import { USER_INFO } from '../../elements/constants';
import { User } from '../../models/user.model';

@Component({
	selector: 'app-main-header',
	imports: [RouterLink, WebNameElement, FontAwesomeModule],
	templateUrl: './main-header.html',
	styleUrl: './main-header.css'
})
export class MainHeader {
	faLogout = faSignOutAlt;
	authService = inject(AuthService);

	user: User = JSON.parse(localStorage.getItem(USER_INFO) || '{}');
}
