import { Component, OnInit } from '@angular/core';
import { MarketService } from '../../../services/market'; 
import { CropListingDTO } from '../../../models/dto.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-officer-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './officer-home.html',
  styleUrl: './officer-home.css'
})
export class OfficerHome implements OnInit {
  activeModule: 'dashboard' | 'crops' | 'documents' | 'subsidies' | 'farmers' = 'dashboard';
  
  // Data Arrays
  pendingListings: CropListingDTO[] = [];
  pendingDocs: any[] = [];
  pendingSubsidies: any[] = [];
  farmersList: any[] = [];
  
  stats = { pendingCrops: 0, awaitingDocs: 0, subsidyApps: 0, totalApprovedToday: 0 };

  constructor(private marketService: MarketService) {}

  ngOnInit(): void {
    this.refreshAllData();
  }

  // Unified data loader to keep Stats Cards accurate
  refreshAllData() {
    // Fetch Crops
    this.marketService.getListingsByStatus('PENDING').subscribe(data => {
      this.pendingListings = data;
      this.stats.pendingCrops = data.length;
    });

    // Fetch Documents
    this.marketService.getPendingDocuments().subscribe(data => {
      this.pendingDocs = data;
      this.stats.awaitingDocs = data.length;
    });

    // Fetch Subsidies
    this.marketService.getPendingSubsidies().subscribe(data => {
      this.pendingSubsidies = data;
      this.stats.subsidyApps = data.length;
    });

    // Fetch Farmers (for the directory)
    this.marketService.getAllFarmers().subscribe(data => {
      this.farmersList = data;
    });
  }

  setModule(moduleName: any) {
    this.activeModule = moduleName;
  }

  // Backend Actions
  approveCrop(id: number) { 
  // Use 'id' here, not 'listingId', because 'id' is what the function received
 this.marketService.validateListing(id, 'APPROVED').subscribe({
  next: (response) => {
    console.log('Success!', response);
    this.refreshAllData(); // Refresh your table
  },
  error: (err) => console.error(err)
});
}

  rejectCrop(id: number) {
    const reason = prompt("Enter reason for rejection:");
    if (!reason) return;
    this.marketService.validateListing(id, 'REJECTED', reason).subscribe({
      next: () => {
        alert('Listing Rejected');
        this.refreshAllData();
      }
    });
  }

  verifyDoc(id: number, status: string) {
    this.marketService.verifyDocument(id, status).subscribe(() => {
      alert(`Document ${status}`);
      this.refreshAllData();
    });
  }
}