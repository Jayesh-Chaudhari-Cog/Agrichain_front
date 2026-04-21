import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-header',
  imports: [RouterLink],
  templateUrl: './main-header.html',
  styleUrl: './main-header.css'
})
export class MainHeader {
  protected readonly title = signal('Agrichain');
}
