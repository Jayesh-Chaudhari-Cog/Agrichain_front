import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WebNameElement } from '../../elements/web-name';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, WebNameElement],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterPage {
  // This matches your FarmerRegistrationDTO fields
  onRegister() {
    console.log("Registration logic initiated...");
  }
}