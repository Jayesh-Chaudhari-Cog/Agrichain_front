import { Routes, Router } from '@angular/router';
import { LoginPage } from './pages/login/login';
import { WelcomePage } from './pages/welcome/welcome';
import { AdminPage } from "./pages/admin/admin";
import { TraderPage } from "./pages/trader/trader";
import { PublicLayoutComponent } from './public-layout';
import { AuthLayoutComponent } from './auth-layout';
import { RegisterComponent } from './pages/register/register';
import { authGuard } from './guards/auth-guard';
import { MarketOfficer } from './pages/market-officer/market-officer';
import { DashboardRedirectComponent } from './guards/dashboard-redirect';
import { inject } from '@angular/core';
import { AuthService } from './services/auth-service';
import { guestGuard } from './guards/guest-guard';

export const routes: Routes = [
    {
        path: '',
        component: PublicLayoutComponent,
        canActivate: [guestGuard],
        children: [
            { path: 'welcome', component: WelcomePage },
            { path: 'login', component: LoginPage },
            { path: '', pathMatch: 'full', component: DashboardRedirectComponent }
        ]
    },
    
    // PROTECTED PAGES
    {
        path: 'dashboard',
        component: AuthLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'admin', component: AdminPage },
            {
                path: 'farmer', 
                children:[
                    { path: 'register', component: RegisterComponent }
                ]
            },
            { path: 'trader', component: TraderPage },
            { path: 'market-officer', component: MarketOfficer },
            { path: '', pathMatch: 'full', component: DashboardRedirectComponent }
        ]
    }
];