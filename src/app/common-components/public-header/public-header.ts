import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WebNameElement } from "../../elements/web-name";

@Component({
  selector: 'app-public-header',
  imports: [RouterLink, WebNameElement],
  templateUrl: './public-header.html',
  styleUrl: './public-header.css'
})
export class PublicHeader {
  protected readonly title = signal('Agrichain');
}
