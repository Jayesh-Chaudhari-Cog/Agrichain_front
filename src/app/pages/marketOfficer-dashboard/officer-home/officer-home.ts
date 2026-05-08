// import { Component, inject, OnInit } from '@angular/core';
// import { MarketService } from '../../../services/market'; 
// import { CropListingDTO } from '../../../models/dto.model';
// import { CommonModule } from '@angular/common';
// import { ToastService } from '../../../services/toast-service';

// @Component({
//   selector: 'app-officer-home',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './officer-home.html',
//   styleUrl: './officer-home.css'
// })
// export class OfficerHome implements OnInit {
//   activeModule: 'dashboard' | 'crops' | 'documents' | 'subsidies' | 'farmers' = 'dashboard';
  
//   pendingDocs: any[] = [];
//   pendingDocsCount: number = 0; // Add this line
//   pendingSubsidiesCount: number = 0; // Add this for the subsidies too
//   totalFarmersCount: number = 0;
//   // Data Arrays
//   pendingListings: CropListingDTO[] = [];
//   //pendingDocs: any[] = [];
//   pendingSubsidies: any[] = [];
//   farmersList: any[] = [];
//   listingsWithDocs: any[] = [];

//   private toast = inject(ToastService);
  
//   //stats = { pendingCrops: 0, awaitingDocs: 0, subsidyApps: 0, totalApprovedToday: 0 };

//   constructor(private marketService: MarketService) {}

  
//   // Unified data loader to keep Stats Cards accurate
//   refreshAllData() {
//     // Fetch Crops
//     this.marketService.getListingsByStatus('PENDING').subscribe(data => {
//       this.pendingListings = data;
//       this.stats.pendingCrops = data.length;
//     });

//     // Fetch Documents
//     // Add : any[] to the data parameter
// this.marketService.getPendingDocuments().subscribe((data: any[]) => {
//   this.pendingDocsCount = data.length;
// });
//     // Fetch Subsidies
//     // this.marketService.getPendingSubsidies().subscribe(data => {
//     //   this.pendingSubsidies = data;
//     //   this.stats.subsidyApps = data.length;
//     // });

//     // Fetch Farmers (for the directory)
//     this.marketService.getAllFarmers().subscribe(data => {
//       this.farmersList = data;
//     });
//   }

//   setModule(moduleName: any) {
//     this.activeModule = moduleName;
//   }

//   // Backend Actions
//   approveCrop(id: number) { 
//   // Use 'id' here, not 'listingId', because 'id' is what the function received
//  this.marketService.validateListing(id, 'APPROVED').subscribe({
//   next: (response) => {
//     console.log('Success!', response);
//     this.refreshAllData(); // Refresh your table
//   },
//   error: (err) => console.error(err)
// });
// }

//   rejectCrop(id: number) {
//     const reason = prompt("Enter reason for rejection:");
//     if (!reason) return;
//     this.marketService.validateListing(id, 'REJECTED', reason).subscribe({
//       next: () => {
//         alert('Listing Rejected');
//         this.refreshAllData();
//       }
//     });
//   }

  

//   verifyDoc(id: number, status: string) {
//     this.marketService.verifyDocument(id, status).subscribe(() => {
//       alert(`Document ${status}`);
//       this.refreshAllData();
//     });
//   }

//   approveSubsidy(id: number) {
//   // 'APPROVED' must match exactly what your DisbursementStatus Enum expects
//   this.marketService.reviewSubisdy(id, 'APPROVED').subscribe({
//     next: (res) => {
//       alert('Subsidy approved and funds disbursed!');
//       this.refreshAllData(); // Reload the counts and lists
//     },
//     error: (err) => console.error('Disbursement failed', err)
//   });
// }


// //documents
// // officer-home.ts

// stats = {
//   pendingCrops: 0,
//   awaitingDocs: 0,
//   subsidyApps: 0,
//   totalApprovedToday: 0,
//   totalFarmersCount: 0
// };

// ngOnInit(): void {
//   console.log("🚀 Officer Portal Initialized!");
//   this.loadDashboardStats();
//   this.refreshQueue(); 
// }

// refreshQueue() {
//   console.log("📡 Attempting to fetch documents...");
  
//   this.marketService.getAllDocuments().subscribe({
//     next: (data: any[]) => {
//       console.log("✅ Documents Fetched:", data);
//       this.listingsWithDocs = data;
//       this.stats.awaitingDocs = data.length; // Update the stat card badge
//     },
//     error: (err) => {
//       console.error("❌ Document Fetch Failed:", err);
//     }
//   });
// }

// loadDashboardStats() {
//   // Fetch pending crops to update the 'Verify Listings' badge
//   this.marketService.getListingsByStatus('PENDING').subscribe(data => {
//     this.stats.pendingCrops = data.length;
//   });
  
//   // Fetch farmers to update the 'Active System Farmers' count
//   this.marketService.getAllFarmers().subscribe(data => {
//     this.stats.totalFarmersCount = data.length;
//   });
// }

// // Variables
// allFarmers: any[] = [];
// //listingsWithDocs: any[] = [];

// // Method to help with document URLs
// getFileUrl(doc: any): string {
//   return this.marketService.getFileUrl(doc.fileName);
// }

// // Method for the Approve button
// approveDoc(docId: number) {
//   this.marketService.verifyDocument(docId, 'VERIFIED').subscribe({
//     next: () => {
//       this.toast.show('Document verified successfully!', 'success');
//       this.refreshAllData(); // Refresh counts and lists
//     },
//     error: (err) => console.error(err)
//   });
// }
// }



import { Component, inject, OnInit,ChangeDetectorRef } from '@angular/core';
import { MarketService } from '../../../services/market'; 
import { CropListingDTO } from '../../../models/dto.model';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast-service';
import { faCheck, faClose } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-officer-home',
  standalone: true,
  imports: [CommonModule, FaIconComponent],
  templateUrl: './officer-home.html',
  styleUrl: './officer-home.css'
})
export class OfficerHome implements OnInit {
  activeModule: 'dashboard' | 'crops' | 'documents' | 'subsidies' | 'farmers' = 'dashboard';

  faCheck = faCheck;
  faClose = faClose;
  // Data Arrays
  pendingListings: CropListingDTO[] = [];
  pendingDocs: any[] = [];
  pendingSubsidies: any[] = [];
  
  // Renamed to match the 'allFarmers' property your HTML is looking for
  allFarmers: any[] = []; 
  listingsWithDocs: any[] = [];

  // Statistics Object
  stats = {
    pendingCrops: 0,
    awaitingDocs: 0,
    subsidyApps: 0,
    totalApprovedToday: 0,
    totalFarmersCount: 0
  };

  private toast = inject(ToastService);
  
  constructor(private marketService: MarketService) {}

  ngOnInit(): void {
    console.log("🚀 Officer Portal Initialized!");
    this.refreshAllData(); 
  }

  /**
   * Consolidated data loader
   */
  refreshAllData() {
    console.log("📡 Syncing all backend data...");

    // 1. Fetch Crop Listings
    this.marketService.getListingsByStatus('PENDING').subscribe({
      next: (data) => {
        console.log("✅ Crop Listings Fetched:", data);
        this.pendingListings = data;
        this.stats.pendingCrops = data.length;
      },
      error: (err) => {
        console.error("❌ Crop Fetch Failed:", err);
        // Changed 'error' to 'alert' to match your ToastService allowed types
        this.toast.show('Failed to load crop listings', 'alert');
      }
    });

    // 2. Fetch Documents
    // this.marketService.getAllDocuments().subscribe({
    //   next: (data: any[]) => {
    //     console.log("✅ Documents Fetched:", data);
    //     this.listingsWithDocs = data;
    //     this.stats.awaitingDocs = data.length;
    //   },
    //   error: (err) => console.error("❌ Document Fetch Failed:", err)
    // });

    this.marketService.getAllDocuments().subscribe((data: any[]) => {
  console.log("🔍 FULL DOCUMENT DATA:", data); // Check the property names in the browser console
  this.listingsWithDocs = data;
});

    // 3. Fetch Farmers
    this.marketService.getAllFarmers().subscribe({
      next: (data) => {
        this.allFarmers = data; // Now matches the HTML *ngFor="let farmer of allFarmers"
        this.stats.totalFarmersCount = data.length;
      },
      error: (err) => console.error("❌ Farmer Fetch Failed:", err)
    });
  }

  setModule(moduleName: 'dashboard' | 'crops' | 'documents' | 'subsidies' | 'farmers') {
    this.activeModule = moduleName;
  }

  // --- Backend Actions ---

  // approveCrop(id: number) { 
  //   this.marketService.validateListing(id, 'APPROVED').subscribe({
  //     next: (response) => {
  //       this.toast.show('Crop listing approved!', 'success');
  //       this.refreshAllData(); 
  //     },
  //     error: (err) => console.error('Approval failed', err)
  //   });
  // }

  approveCrop(id: number) { 
  // You can use a prompt to get a reason, or hardcode one for now
  const reason = prompt("Enter approval remarks:", "Quality standards verified") || "Verified by Officer";
  
  console.log("📡 Attempting to approve Crop ID:", id);
  
  // Pass all 3 arguments: id, status, and reason
  this.marketService.approveCrop(id, 'VALIDATED', reason).subscribe({
    next: (response) => {
      console.log('✅ Crop Approved Successfully:', response);
      this.toast.show('Crop listing approved!', 'success');

      // Update local UI
      this.pendingListings = this.pendingListings.filter(item => item.listingId !== id);
      this.stats.pendingCrops = this.pendingListings.length;
    },
    error: (err) => {
      console.error('❌ Approval failed', err);
      this.toast.show('Failed to approve crop', 'alert');
    }
  });
}

  // rejectCrop(id: number) {
  //   const reason = prompt("Enter reason for rejection:");
  //   if (!reason) return;
  //   this.marketService.validateListing(id, 'REJECTED', reason).subscribe({
  //     next: () => {
  //       this.toast.show('Listing Rejected', 'info');
  //       this.refreshAllData();
  //     }
  //   });
  // }

  rejectCrop(id: number) {
  const reason = prompt("Enter rejection reason:", "Quality standards not met");
  
  if (!reason) return; // Don't proceed if they cancel the prompt

  // Make sure you are calling the same service method that worked for approval
  this.marketService.approveCrop(id, 'REJECTED', reason).subscribe({
    next: (response) => {
      this.toast.show('Crop listing rejected', 'alert');
      this.pendingListings = this.pendingListings.filter(item => item.listingId !== id);
      this.stats.pendingCrops = this.pendingListings.length;
    },
    error: (err) => {
      console.error('❌ Rejection failed', err);
      // If you still see 'PUT not supported', check your browser network tab 
      // to see if it's actually sending a PATCH or a PUT.
    }
  });
}

//   approveDoc(docId: number) {
//   // Ensure this matches the backend (patch vs put)
//   this.marketService.verifyDocument(docId, 'VERIFIED').subscribe({
//     next: () => {
//       this.toast.show('Document verified successfully!', 'success');

//       // 1. Manually remove the document from the current view array
//       // This makes the row disappear INSTANTLY from the HTML table
//       this.listingsWithDocs = this.listingsWithDocs.filter(doc => doc.documentId !== docId);

//       // 2. Update the badge count locally so it reflects the change immediately
//       this.stats.awaitingDocs = this.listingsWithDocs.length;

//       // 3. Optional: Sync everything else with the server
//       this.refreshAllData(); 
//     },
//     error: (err) => {
//       console.error("Verification failed:", err);
//       this.toast.show('Failed to verify document', 'alert');
//     }
//   });
// }


// Method for the Approve button
approveDoc(docId: number) {
  if (!docId) {
    console.error("❌ documentId is missing! Still receiving null/undefined.");
    return;
  }

  this.marketService.verifyDocument(docId, 'VERIFIED').subscribe({
    next: () => {
      this.toast.show('Document verified successfully!', 'success');
      
      // Update filter to use 'id' to match the HTML
      this.listingsWithDocs = this.listingsWithDocs.filter(d => d.id !== docId);
      this.stats.awaitingDocs = this.listingsWithDocs.length;
    },
    error: (err) => {
      console.error("Verification failed", err);
      this.toast.show('Backend error: Check logs', 'alert');
    }
  });
}

rejectDoc(docId: number) {
  const reason = prompt("Please enter a reason for rejection:");
  if (!reason || !docId) return;

  this.marketService.verifyDocument(docId, 'REJECTED').subscribe({
    next: () => {
      this.toast.show('Document has been rejected', 'info');
      this.listingsWithDocs = this.listingsWithDocs.filter(d => d.id !== docId);
      this.stats.awaitingDocs = this.listingsWithDocs.length;
    },
    error: (err) => console.error("Rejection failed", err)
  });
}

  approveSubsidy(id: number) {
    this.marketService.reviewSubisdy(id, 'APPROVED').subscribe({
      next: (res) => {
        alert('Subsidy approved and funds disbursed!');
        this.refreshAllData();
      },
      error: (err) => console.error('Disbursement failed', err)
    });
  }

  getFileUrl(doc: any): string {
    return this.marketService.getFileUrl(doc.fileName);
  }
}

