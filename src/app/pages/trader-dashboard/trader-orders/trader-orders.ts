import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketService } from '../../../services/market';
import { OrderDTO } from '../../../models/dto.model';
import { Loader } from '../../../common-components/loader/loader';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-trader-orders',
  standalone: true,
  imports: [CommonModule, Loader],
  templateUrl: './trader-orders.html',
  styleUrl: './trader-orders.css'
})
export class TraderOrders implements OnInit {
  private marketService = inject(MarketService);
  private authService = inject(AuthService);
  
  orders = signal<OrderDTO[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    const currentUserObj = this.authService.currentUser();
    if (!currentUserObj || Object.keys(currentUserObj).length === 0) return;
    
    const traderId = currentUserObj.id || currentUserObj.id;

    if (!traderId) {
      console.error('Trader ID not found in user info');
      return;
    }

    this.loading.set(true);
    this.marketService.getOrdersByTrader(traderId).subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching trader orders', err);
        this.loading.set(false);
      }
    });
  }
}
