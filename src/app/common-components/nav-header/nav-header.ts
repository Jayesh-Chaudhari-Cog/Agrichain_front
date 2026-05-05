import { Component, inject } from "@angular/core";
import { AuthService } from "../../services/auth-service";
import { ROLE_CONFIG, NavLink } from "../../models/nav.model";
import { RouterLink } from "@angular/router";
import { LOGIN_INFO } from "../../elements/constants";
import { CommonModule } from "@angular/common";

@Component({
    selector: "nav-header",
    imports: [RouterLink, CommonModule],
    templateUrl: "./nav-header.html",
    styleUrl: "nav-header.css"
})
export class NavHeader {
    menuLinks: NavLink[] = [];
    private authService = inject(AuthService);

    ngOnInit() {
        const loggedInuser = this.authService.loggedInUser();
        if(loggedInuser && loggedInuser.role)
            this.menuLinks = ROLE_CONFIG[loggedInuser.role] || [];
    }
}