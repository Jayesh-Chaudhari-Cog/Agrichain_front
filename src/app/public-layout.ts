import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PublicHeader } from './common-components/public-header';
import { App } from "./app";
import { Footer } from './common-components/footer';

@Component({
    selector: 'public-layout',
    imports: [RouterLink, PublicHeader, Footer, RouterOutlet],
    template: `
    <app-public-header></app-public-header>
    <main>
        <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `
})
export class PublicLayoutComponent {
    protected readonly title = signal('Agrichain');
}
