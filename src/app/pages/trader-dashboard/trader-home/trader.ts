import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketService } from '../../../services/market';
import { CropListingStatus } from '../../../models/enum.model';

@Component({
  selector: 'app-trader-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trader.html',
  styleUrl: './trader.css'
})
export class TraderPage implements OnInit {
  private marketService = inject(MarketService);
  
  activeModule = 'dashboard';
  currentTab = signal<'home' | 'listings'>('home');

  listings = signal<any[]>([]);
  myOrders = signal<any[]>([]);
  myTransactions = signal<any[]>([]);
  auditLogs = signal<any[]>([]);
  
  // Metrics
  traderId = 101;
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

  loadInitialData() {
    this.marketService.getListingsByStatus(CropListingStatus.VALIDATED).subscribe(data => {
      this.listings.set(data);
    });

    this.marketService.getAllLogs().subscribe(logs => {
      this.auditLogs.set(logs);
    });
  }
}