import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login';
import { WelcomePage } from './pages/welcome/welcome';
import { AdminHome } from "./pages/admin-dashboard/admin-home/admin-home";
import { AdminReports } from './pages/admin-dashboard/admin-reports/admin-reports';
import { AdminNotifications } from './pages/admin-dashboard/admin-notifications/admin-notifications';
import { TraderPage } from "./pages/trader-dashboard/trader-home/trader";
import { TraderCroplistings } from './pages/trader-dashboard/trader-croplistings/trader-croplistings';
import { TraderOrders } from './pages/trader-dashboard/trader-orders/trader-orders';
import { PublicLayoutComponent } from './public-layout';
import { AuthLayoutComponent } from './auth-layout';
import { RegisterComponent } from './pages/register/register';
import { FarmerDashboardPage } from './pages/farmer-dashboard/farmer-home/farmer-dashboard'; // Added Dashboard Import
import { OfficerHome } from './pages/marketOfficer-dashboard/officer-home/officer-home';
import { OfficerInventory } from './pages/marketOfficer-dashboard/officer-inventory/officer-inventory';
import { OfficerHistory } from './pages/marketOfficer-dashboard/officer-history/officer-history';
import { OfficerDocument } from './pages/marketOfficer-dashboard/officer-document/officer-document';
import { AuditorHome } from './pages/auditor-dashboard/auditor-home/auditor-home';
import { AuditComponent } from './pages/auditor-dashboard/audit/audit';
import { ComplianceHomeComponent } from './pages/compliance-dashboard/compliance-home/compliance-home';
import { ComplianceComponent } from './pages/compliance-dashboard/compliance/compliance';
import { ManagerDashboard } from './pages/manager-dashboard/manager-dashboard';
import { ProfilePage } from './pages/profile/profile';

// Guards
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { roleGuard } from './core/guards/role-guard';
import { DashboardRedirectComponent } from './core/guards/dashboard-redirect';
import { FarmerListings } from './pages/farmer-dashboard/farmer-listings/farmer-listings';
import { FarmerSubsidy } from './pages/farmer-dashboard/farmer-subsidy/farmer-subsidy';

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
                data: { roles: ['ADMIN'] },
                children: [
                    { path: 'home', component: AdminHome },
                    { path: 'reports', component: AdminReports },
                    { path: 'notifications', component: AdminNotifications },
                    { path: '', pathMatch: 'full', redirectTo: 'home' }
                ]
            },

            // FARMER SECTION (Updated to include Dashboard)
            {
                path: 'farmer',
                canActivate: [roleGuard],
                data: { roles: ['FARMER'] },
                children: [
                    { path: 'home', component: FarmerDashboardPage },
                    { path: 'register', component: RegisterComponent },
                    { path: 'listings', component: FarmerListings },
                    { path: 'subsidies', component: FarmerSubsidy },
                    { path: '', pathMatch: 'full', redirectTo: 'home' }
                ]
            },

            // TRADER SECTION
            {
                path: 'trader',
                canActivate: [roleGuard],
                data: { roles: ['TRADER'] },
                children: [
                    { path: 'home', component: TraderPage },
                    { path: 'croplistings', component: TraderCroplistings },
                    { path: 'orders', component: TraderOrders },
                    { path: '', pathMatch: 'full', redirectTo: 'home' }
                ]
            },

            // OFFICER SECTION
            {
                path: 'officer',
                canActivate: [roleGuard],
                data: { roles: ['OFFICER'] },
                children: [
                    { path: 'home', component: OfficerHome },
                    { path: 'history', component: OfficerHistory },
                    { path: '', pathMatch: 'full', redirectTo: 'home' }
                ]
            },

            // AUDITOR SECTION
            {
                path: 'auditor',
                canActivate: [roleGuard],
                data: { roles: ['AUDITOR'] },
                children: [
                    { path: 'home', component: AuditorHome },
                    { path: 'entry', component: AuditComponent },
                    { path: '', pathMatch: 'full', redirectTo: 'home' }
                ]
            },

            // COMPLIANCE SECTION
            {
                path: 'compliance',
                canActivate: [roleGuard],
                data: { roles: ['COMPLIANCE'] },
                children: [
                    { path: 'home', component: ComplianceHomeComponent },
                    { path: 'entry', component: ComplianceComponent },
                    { path: '', pathMatch: 'full', redirectTo: 'home' }
                ]
            },

            // MANAGER SECTION
            {
                path: 'manager',
                canActivate: [roleGuard],
                data: { roles: ['MANAGER'] },
                children: [
                    { path: 'home', component: ManagerDashboard },
                    { path: '', pathMatch: 'full', redirectTo: 'home' }
                ]
            },

            // SHARED PROTECTED ROUTES
            { path: 'profile', component: ProfilePage },
            { path: '', pathMatch: 'full', component: DashboardRedirectComponent }
        ]
    },

    // FALLBACK
    { path: '**', redirectTo: '/welcome' }
];
