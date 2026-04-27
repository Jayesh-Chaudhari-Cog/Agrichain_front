import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login';
import { WelcomePage } from './pages/welcome/welcome';
import { AdminPage } from "./pages/admin/admin";
import { PublicLayoutComponent } from './public-layout';
import { AuthLayoutComponent } from './auth-layout';

// NEW IMPORTS - Ensure these paths match your new folders
import { RegisterPage } from './pages/register/register';
import { FarmerDashboardPage } from './pages/farmer-dashboard/farmer-dashboard';

// import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: PublicLayoutComponent,
        children: [
            { path: 'welcome', component: WelcomePage },
            { path: 'login', component: LoginPage },
            { path: 'register', component: RegisterPage }, // <-- ADDED REGISTRATION HERE
            { path: '', redirectTo: '/welcome', pathMatch: 'full' }
        ]
    },
    // PROTECTED PAGES
    {
        path: 'app',
        component: AuthLayoutComponent,
        // canActivate: [authGuard], 
        children: [
            { path: 'admin', component: AdminPage },
            { path: 'farmer-dashboard', component: FarmerDashboardPage } // <-- ADDED DASHBOARD HERE
        ]
    }
    // PROTECTED PAGES
    // {
    //     path: 'app',
    //     component: AuthLayoutComponent,
    //     canActivate: [authGuard], // Here JWT check happens
    //     children: [
    //         { path: 'admin', component: AdminPage }
    //     ]
    // }
];