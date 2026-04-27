import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MainHeader } from './common-components/main-header/main-header';
import { Footer } from './common-components/footer/footer';
import { App } from "./app";

@Component({
    selector: 'auth-layout',
    imports: [RouterLink, MainHeader, Footer, RouterOutlet],
    template: `
    <app-main-header></app-main-header>
    <main class="auth-main">
        <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `
})
export class AuthLayoutComponent {
    protected readonly title = signal('Agrichain');
}
