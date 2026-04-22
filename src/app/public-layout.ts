import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PublicHeader } from './header-footer/public-header';
import { App } from "./app";
import { Footer } from './header-footer/footer';

@Component({
    selector: 'public-layout',
    imports: [RouterLink, PublicHeader, Footer, RouterOutlet],
    template: `
    <app-public-header></app-public-header>
    <main class="public-main">
        <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `
})
export class PublicLayoutComponent {
    protected readonly title = signal('Agrichain');
}
