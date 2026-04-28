import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { App } from "./app";
import { Footer } from './common-components/footer/footer';

@Component({
    selector: 'public-layout',
    imports: [RouterLink, Footer, RouterOutlet],
    template: `
    <main>
        <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `
})
export class PublicLayoutComponent {
    protected readonly title = signal('Agrichain');
}
