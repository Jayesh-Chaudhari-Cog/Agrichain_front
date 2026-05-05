import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login';
import { WelcomePage } from './pages/welcome/welcome';
import { AdminPage } from "./pages/admin/admin";
import { TraderPage } from "./pages/trader/trader";
import { PublicLayoutComponent } from './public-layout';
import { AuthLayoutComponent } from './auth-layout';
import { RegisterPage } from './pages/register/register';
import { authGuard } from './guards/auth-guard';
import { MarketOfficer } from './pages/market-officer/market-officer';

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
        // canActivate: [authGuard],
        children: [
            { path: 'admin', component: AdminPage },
            { path: 'register', component: RegisterPage },
            { path: 'trader', component: TraderPage },
            { path: 'market-officer', component: MarketOfficer },
        ]
    }
];