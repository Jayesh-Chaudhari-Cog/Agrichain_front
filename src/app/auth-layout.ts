import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MainHeader } from './header-footer/main-header';
import { Footer } from './header-footer/footer';
import { App } from "./app";

@Component({
    selector: 'auth-layout',
    imports: [RouterLink, MainHeader, Footer, App, RouterOutlet],
    template: `
    <app-main-header></app-main-header>
    <main>
        <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `
})
export class AuthLayoutComponent {
    protected readonly title = signal('Agrichain');
}
