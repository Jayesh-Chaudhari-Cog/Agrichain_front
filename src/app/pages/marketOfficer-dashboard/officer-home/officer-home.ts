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
  
  pendingDocs: any[] = [];
  pendingDocsCount: number = 0; // Add this line
  pendingSubsidiesCount: number = 0; // Add this for the subsidies too
  totalFarmersCount: number = 0;
  // Data Arrays
  pendingListings: CropListingDTO[] = [];
  //pendingDocs: any[] = [];
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
    // Add : any[] to the data parameter
this.marketService.getPendingDocuments().subscribe((data: any[]) => {
  this.pendingDocsCount = data.length;
});
    // Fetch Subsidies
    // this.marketService.getPendingSubsidies().subscribe(data => {
    //   this.pendingSubsidies = data;
    //   this.stats.subsidyApps = data.length;
    // });

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

  approveSubsidy(id: number) {
  // 'APPROVED' must match exactly what your DisbursementStatus Enum expects
  this.marketService.reviewSubisdy(id, 'APPROVED').subscribe({
    next: (res) => {
      alert('Subsidy approved and funds disbursed!');
      this.refreshAllData(); // Reload the counts and lists
    },
    error: (err) => console.error('Disbursement failed', err)
  });
}
}