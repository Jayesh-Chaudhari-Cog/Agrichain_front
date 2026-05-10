import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-page.html',
  styleUrl: './payment-page.css'
})
export class PaymentPage {
  cardNumber = '';
  cardHolder = '';
  expiryDate = '';
  cvv = '';
  
  isProcessing = signal(false);
  paymentSuccess = signal(false);

  processPayment(event: Event) {
    event.preventDefault();
    
    // Fake payment processing delay
    this.isProcessing.set(true);
    
    setTimeout(() => {
      this.isProcessing.set(false);
      this.paymentSuccess.set(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        this.paymentSuccess.set(false);
        this.cardNumber = '';
        this.cardHolder = '';
        this.expiryDate = '';
        this.cvv = '';
      }, 3000);
      
    }, 2000);
  }
}
