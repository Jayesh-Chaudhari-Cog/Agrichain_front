import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WebNameElement } from "../../elements/web-name";

@Component({
  selector: 'app-main-header',
  imports: [RouterLink, WebNameElement],
  templateUrl: './main-header.html',
  styleUrl: './main-header.css'
})
export class MainHeader {
  protected readonly title = signal('Agrichain');
}
