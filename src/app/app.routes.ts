import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login';
import { WelcomePage } from './pages/welcome/welcome';
import { AdminHome } from "./pages/admin-dashboard/admin-home/admin-home";
import { AdminReports } from './pages/admin-dashboard/admin-reports/admin-reports';
import { TraderPage } from "./pages/trader/trader";
import { PublicLayoutComponent } from './public-layout';
import { AuthLayoutComponent } from './auth-layout';
import { RegisterComponent } from './pages/register/register';
import { authGuard } from './core/guards/auth-guard';
import { MarketOfficer } from './pages/market-officer/market-officer';
import { DashboardRedirectComponent } from './core/guards/dashboard-redirect';
import { guestGuard } from './core/guards/guest-guard';
import { roleGuard } from './core/guards/role-guard';
import { AdminNotifications } from './pages/admin-dashboard/admin-notifications/admin-notifications';
import { OfficerHome } from './pages/marketOfficer-dashboard/officer-home/officer-home';
import { OfficerInventory } from './pages/marketOfficer-dashboard/officer-inventory/officer-inventory';
import { OfficerHistory } from './pages/marketOfficer-dashboard/officer-history/officer-history';

// IMPORT YOUR NEW FARMER DASHBOARD COMPONENT HERE
import { FarmerDashboardPage } from './pages/farmer-dashboard/farmer-dashboard'; 

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
            // ADMIN SECTION
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

            // FARMER SECTION (Updated with Dashboard)
            {
                path: 'farmer', 
                canActivate: [roleGuard],
                data: {roles: ['FARMER']},
                children: [
                    { path: 'home', component: FarmerDashboardPage }, // Added Dashboard
                    { path: 'register', component: RegisterComponent },
                    { path: '', pathMatch: 'full', redirectTo: 'home' } // Default redirect
                ]
            },

            // TRADER SECTION
            { path: 'trader', component: TraderPage },
            
            // MARKET OFFICER SECTION
            { 
                path: 'officer', 
                children: [
                    { path: 'home', component: OfficerHome },
                    { path: 'inventory', component: OfficerInventory },
                    { path: 'history', component: OfficerHistory },
                    { path: '', pathMatch: 'full', redirectTo: 'home' }
                ]
             },

            // SHARED REDIRECT LOGIC
            { path: '', pathMatch: 'full', component: DashboardRedirectComponent }
        ]
    }
];