import { Component } from "@angular/core";
import { AuthService } from "../../services/auth-service";

@Component({
    selector: "nav-header",
    templateUrl: "./nav-header.html",
    styleUrl: "nav-header.css"
})
export class NavHeader {
    menuLinks: NavLink[] = [];

    constructor(private authService: AuthService) { }

    ngOnInit() {
        const userRole = localStorage.getItem();
        this.menuLinks = ROLE_CONFIG[userRole] || [];
    }
}