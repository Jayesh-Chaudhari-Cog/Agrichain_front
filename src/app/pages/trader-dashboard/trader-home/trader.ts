import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketService } from '../../../services/market'; // Standardized to use your existing MarketService

@Component({
  selector: 'app-trader-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trader.html',
  styleUrl: './trader.css'
})
export class TraderPage implements OnInit {
  private marketService = inject(MarketService);
  
  // View & Tab State
  activeModule = 'dashboard';
  currentTab = signal<'home' | 'listings'>('home');

  // Data Signals
  listings = signal<any[]>([]);
  myOrders = signal<any[]>([]);
  myTransactions = signal<any[]>([]);
  auditLogs = signal<any[]>([]);
  
  // Metrics
  traderId = 101; // Mock current logged-in trader ID
  pendingPaymentsCount: number = 0;

  constructor() {
    // Initial dummy data for visual testing before API responses arrive
    this.myTransactions.set([
      { transactionId: 101, orderId: 5001, transactionAmount: 15000, transactionDate: new Date(), transactionStatus: 'PENDING' },
      { transactionId: 102, orderId: 5002, transactionAmount: 8500, transactionDate: new Date(), transactionStatus: 'COMPLETED' }
    ]);

    this.auditLogs.set([
      { timestamp: new Date(), targetType: 'CROP', targetId: 201, action: 'APPROVED', reason: 'Quality standards met' },
      { timestamp: new Date(), targetType: 'CROP', targetId: 202, action: 'REJECTED', reason: 'Incomplete documentation' }
    ]);
  }

  ngOnInit() {
    this.loadInitialData();
  }

  /**
   * Loads core data from the backend services via the 8090 Gateway
   */
  loadInitialData() {
    // 1. Get Approved Crops for the Market Linkage module
    this.marketService.getListingsByStatus('APPROVED').subscribe(data => {
      this.listings.set(data);
    });
    
    // 2. Get Trader's specific orders
    this.marketService.getOrdersByTrader(this.traderId).subscribe(data => {
      this.myOrders.set(data);
    });

    // 3. Get System Audit Logs for Analysis module
    this.marketService.getAllLogs().subscribe(logs => {
      this.auditLogs.set(logs);
    });

    // 4. Get Pending Transactions for Finance module
    this.marketService.getTransactionsByStatus('PENDING').subscribe(txs => {
      this.myTransactions.set(txs);
      this.updatePendingCount();
    });
  }

  /**
   * Navigation handler
   */
  setModule(moduleName: string) {
    this.activeModule = moduleName;
    if (moduleName === 'dashboard') {
      this.loadInitialData();
    }
  }

  /**
   * Financial Action: Finalize a pending payment via Transaction API
   */
  finalizeTx(transactionId: number) {
    this.marketService.finalizeTransaction(transactionId).subscribe({
      next: () => {
        // Optimistic UI update or refresh all data
        alert('Payment finalized successfully!');
        this.loadInitialData();
      },
      error: (err) => alert('Payment failed: ' + err.message)
    });
  }

  /**
   * Market Action: Place an order for a crop
   */
  buyCrop(listing: any) {
    const orderDto = {
      listingId: listing.id,
      traderId: this.traderId,
      quantity: listing.quantity,
      status: 'PLACED'
    };

    this.marketService.placeOrder(orderDto).subscribe({
      next: (order) => {
        alert('Order Placed Successfully! Initiating Transaction...');
        this.initiatePayment(order, listing.price * listing.quantity);
      },
      error: (err) => alert('Order failed: ' + err.message)
    });
  }

  /**
   * Internal logic to initiate financial transaction after order placement
   */
  private initiatePayment(order: any, totalAmount: number) {
    const txRequest = {
      orderId: order.id,
      amount: totalAmount
    };
    
    this.marketService.initiateTransaction(txRequest).subscribe(() => {
      this.loadInitialData(); // Refresh all lists and counts
    });
  }

  private updatePendingCount() {
    this.pendingPaymentsCount = this.myTransactions().filter(t => t.transactionStatus === 'PENDING').length;
  }

  switchTab(tab: 'home' | 'listings') {
    this.currentTab.set(tab);
  }
}