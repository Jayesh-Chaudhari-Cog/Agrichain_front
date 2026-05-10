import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TraderApiService } from '../../../services/trader.service';

@Component({
  selector: 'app-trader-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trader.html',
  styleUrl: './trader.css'
})
export class TraderPage implements OnInit {
  private api = inject(TraderApiService);
  
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
    // Initialize with dummy data (This will be overwritten by API calls in ngOnInit)
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
    this.updatePendingCount();
  }

  /**
   * Loads core data from the backend services
   */
  loadInitialData() {
    // 1. Load Approved Listings for the Marketplace
    this.api.getApprovedListings().subscribe(data => this.listings.set(data));
    
    // 2. Load Trader's specific orders
    this.api.getOrdersByTrader(this.traderId).subscribe(data => {
      this.myOrders.set(data);
    });

    // 3. Load Audit Logs (From CropMarketController)
    this.api.getAuditLogs().subscribe(logs => {
      this.auditLogs.set(logs);
    });

    // 4. Load Pending Transactions
    this.api.getTransactionsByStatus('PENDING').subscribe(txs => {
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
   * Financial Action: Finalize a pending payment
   */
  finalizeTx(transactionId: number) {
    console.log('Finalizing payment for ID:', transactionId);
    
    this.api.finalizeTransaction(transactionId).subscribe({
      next: (res) => {
        // Update local signal state for immediate UI feedback
        const updated = this.myTransactions().map(tx => 
          tx.transactionId === transactionId ? { ...tx, transactionStatus: 'COMPLETED' } : tx
        );
        this.myTransactions.set(updated);
        this.updatePendingCount();
        alert('Payment finalized successfully!');
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

    this.api.placeOrder(orderDto).subscribe({
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
    
    this.api.initiateTransaction(txRequest).subscribe(tx => {
      console.log('Transaction Created:', tx);
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