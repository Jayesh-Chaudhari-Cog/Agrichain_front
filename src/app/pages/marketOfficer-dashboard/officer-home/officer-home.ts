import { Component, OnInit } from '@angular/core';
import { MarketService } from '../../../services/market'; 
import { CropListingDTO } from '../../../models/dto.model';
import { CommonModule } from '@angular/common'; // Import CommonModule for structural directives

@Component({
  selector: 'app-officer-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './officer-home.html',
  styleUrl: './officer-home.css'
})
export class OfficerHome implements OnInit {
  pendingListings: CropListingDTO[] = [];
  filteredListings: CropListingDTO[] = [];
  stats = { pendingCount: 0, urgentReviews: 0 };
  
  // Track document for the inline preview
  selectedListing: CropListingDTO | null = null;

  constructor(private marketService: MarketService) {}

  ngOnInit(): void {
    this.fetchPendingListings();
  }

  fetchPendingListings(): void {
    this.marketService.getListingsByStatus('PENDING').subscribe({
      next: (data: CropListingDTO[]) => {
        this.pendingListings = data;
        this.filteredListings = data;
        this.stats.pendingCount = data.length;
        this.stats.urgentReviews = data.filter((item: CropListingDTO) => item.quantity > 500).length;
      },
      error: (err: any) => console.error('Error fetching listings', err)
    });
  }

  // Opens the inline review pane
  openDocumentReview(listing: CropListingDTO): void {
    if (listing.documentUrl) {
      this.selectedListing = listing;
    } else {
      alert('No document proof was uploaded for this listing.');
    }
  }

  closeReview(): void {
    this.selectedListing = null;
  }

  approveListing(id: number): void {
    if(confirm('Verify that farmer documents are valid and approve this listing?')) {
      this.marketService.validateListing(id).subscribe({
        next: () => {
          alert('Listing approved successfully.');
          this.closeReview();
          this.fetchPendingListings();
        },
        error: (err: any) => alert('Action failed: ' + (err.message || 'Unknown error'))
      });
    }
  }
}