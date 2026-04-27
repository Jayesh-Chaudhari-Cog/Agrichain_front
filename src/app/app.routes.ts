import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login';
import { WelcomePage } from './pages/welcome/welcome';
import { AdminPage } from "./pages/admin/admin";
import { TraderPage } from "./pages/trader/trader";
import { PublicLayoutComponent } from './public-layout';
import { AuthLayoutComponent } from './auth-layout';

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
    // PROTECTED PAGES (View-only for now)
    {
        path: 'dashboard',
        component: AuthLayoutComponent,
        children: [
            { path: 'admin', component: AdminPage },
            { path: 'trader', component: TraderPage }
        ]
    }
];