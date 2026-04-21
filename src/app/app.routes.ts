import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login';
import { WelcomePage } from './pages/welcome/welcome';

export const routes: Routes = [
    { path: '', redirectTo: '/welcome', pathMatch: 'full' }, // Default route
    { path: 'login', component: LoginPage },
    { path: 'welcome', component: WelcomePage },
];
