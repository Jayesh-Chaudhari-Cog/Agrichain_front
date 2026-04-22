import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login';
import { WelcomePage } from './pages/welcome/welcome';
import { AdminPage } from "./pages/admin/admin";
import { PublicLayoutComponent } from './public-layout';
import { AuthLayoutComponent } from './auth-layout';
// import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: PublicLayoutComponent,
        children: [
            { path: 'welcome', component: WelcomePage },
            { path: 'login', component: LoginPage },
            { path: '', redirectTo: '/welcome', pathMatch: 'full' }
        ]
    },
    // PROTECTED PAGES
    {
        path: 'dashboard',
        component: AuthLayoutComponent,
        // canActivate: [authGuard], // Here JWT check happens
        children: [
            { path: 'admin', component: AdminPage },
            { path: '', redirectTo: '/dashboard/admin', pathMatch: 'full' }
        ]
    }
];
