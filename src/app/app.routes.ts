import { Routes, Router } from '@angular/router';
import { LoginPage } from './pages/login/login';
import { WelcomePage } from './pages/welcome/welcome';
import { AdminHome } from "./pages/admin-dashboard/admin-home/admin-home";
import { AdminReports } from './pages/admin-dashboard/admin-reports/admin-reports';
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
import { roleGuard } from './guards/role-guard';
import { AdminNotifications } from './pages/admin-dashboard/admin-notifications/admin-notifications';
import { AuditComponent } from './pages/auditor-dashboard/audit/audit';
import { ComplianceComponent } from './pages/compliance/compliance';
import { AuditorHome } from './pages/auditor-dashboard/auditor-home/auditor-home';

export const routes: Routes = [
    {
        path: '',
        component: PublicLayoutComponent,
        canActivate: [guestGuard],
        children: [
            { path: 'welcome', component: WelcomePage },
            { path: 'login', component: LoginPage },
            { path: '', pathMatch: 'full', redirectTo: '/welcome' }
        ]
    },
    
    // PROTECTED PAGES
    {
        path: 'dashboard',
        component: AuthLayoutComponent,
        canActivate: [authGuard],
        children: [
            { 
                path: 'admin', 
                canActivate: [roleGuard],
                data: {roles: ['ADMIN']},
                children: [
                    { path: 'home', component: AdminHome },
                    { path: 'reports', component: AdminReports },
                    { path: 'notifications', component: AdminNotifications },
                    { path: '', pathMatch: 'full', redirectTo: 'home'}
                ]
            },
            {
                path: 'farmer', 
                canActivate: [roleGuard],
                data: {roles: ['FARMER']},
                children: [
                    { path: 'register', component: RegisterComponent},
                ]
            },
            {
                path: 'auditor',
                canActivate: [roleGuard],
                data: {roles: ['AUDITOR']},
                children: [
                   
                    { path: 'home', component: AuditorHome },      // View this code above
        { path: 'entry', component: AuditComponent },
                    { path: '', pathMatch: 'full', redirectTo: 'home'}
                ]
            },
            { path: 'trader', component: TraderPage },
            { path: 'market-officer', component: MarketOfficer },
            { path: '', pathMatch: 'full', component: DashboardRedirectComponent }

        ]
    }
];