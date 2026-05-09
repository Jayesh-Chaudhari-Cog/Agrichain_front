import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketService } from '../../../services/market';
import { OrderDTO } from '../../../models/dto.model';
import { USER_INFO, getCurrentUser } from '../../../elements/constants';
import { Loader } from '../../../common-components/loader/loader';

@Component({
  selector: 'app-trader-orders',
  standalone: true,
  imports: [CommonModule, Loader],
  templateUrl: './trader-orders.html',
  styleUrl: './trader-orders.css'
})
export class TraderOrders implements OnInit {
  private marketService = inject(MarketService);
  
  orders = signal<OrderDTO[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    const currentUser = getCurrentUser();
    if (!currentUser || Object.keys(currentUser).length === 0) return;
    
    const traderId = currentUser.id || currentUser.userId; // Check which field is used

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
