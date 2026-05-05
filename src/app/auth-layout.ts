import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MainHeader } from './common-components/main-header/main-header';
import { Footer } from './common-components/footer/footer';
import { NavHeader } from './common-components/nav-header/nav-header';
import { App } from "./app";

@Component({
    selector: 'auth-layout',
    imports: [MainHeader, Footer, RouterOutlet, NavHeader],
    template: `
    <app-main-header />
    <main class="auth-main">
        <nav-header />
        <router-outlet />
    </main>
    <app-footer />
  `
})
export class AuthLayoutComponent {
    protected readonly title = signal('Agrichain');
}
