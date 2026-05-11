import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MarketService } from '../../../services/market'; // Adjust path based on your folder structure

@Component({
  selector: 'trader-croplistings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trader-croplistings.html',
  styleUrl: './trader-croplistings.css'
})
export class TraderCroplistings implements OnInit {
  private marketService = inject(MarketService);

  // Signal to hold the 50+ items we saw in your console
  listings = signal<any[]>([]);

  ngOnInit(): void {
    this.loadMarketCrops();
  }

  loadMarketCrops(): void {
    // Calling the same endpoint that returns your Array(50)
    this.marketService.getListingsByStatus('VALIDATED').subscribe({
      next: (data) => {
        this.listings.set(data);
      },
      error: (err) => console.error('Error fetching crop cards:', err)
    });
  }
}