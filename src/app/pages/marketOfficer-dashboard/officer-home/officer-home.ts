
// import { Component, inject, OnInit,ChangeDetectorRef, signal } from '@angular/core';
// import { MarketService } from '../../../services/market'; 
// import { CropListingDTO } from '../../../models/dto.model';
// import { CommonModule } from '@angular/common';
// import { ToastService } from '../../../services/toast-service';
// import { faCheck, faClose } from '@fortawesome/free-solid-svg-icons';
// import { FaIconComponent } from "@fortawesome/angular-fontawesome";
// import { NotificationServiceFarmer } from '../../../services/notification';

// @Component({
//   selector: 'app-officer-home',
//   standalone: true,
//   imports: [CommonModule, FaIconComponent],
//   templateUrl: './officer-home.html',
//   styleUrl: './officer-home.css'
// })
// export class OfficerHome implements OnInit {
//   activeModule: 'dashboard' | 'crops' | 'documents' | 'subsidies' | 'farmers' = 'dashboard';

//   faCheck = faCheck;
//   faClose = faClose;
//   // Data Arrays
//   pendingListings: CropListingDTO[] = [];
//   pendingDocs: any[] = [];
//   pendingSubsidies: any[] = [];
  
//   // Renamed to match the 'allFarmers' property your HTML is looking for
//   allFarmers: any[] = []; 
//   listingsWithDocs: any[] = [];


//   subsidies = signal<any[]>([]);
//   totalDisbursed = signal(4500000);

//   // Statistics Object
//   stats = {
//     pendingCrops: 0,
//     awaitingDocs: 0,
//     subsidyApps: 0,
//     totalApprovedToday: 0,
//     totalFarmersCount: 0
//   };

//   private toast = inject(ToastService);
  
//   constructor(private marketService: MarketService,private notifService: NotificationServiceFarmer) {}

//   ngOnInit(): void {
//     console.log("🚀 Officer Portal Initialized!");
//     this.refreshAllData(); 
//   }

//   /**
//    * Consolidated data loader
//    */
//   refreshAllData() {
//     console.log("📡 Syncing all backend data...");

//     // 1. Fetch Crop Listings
//     this.marketService.getListingsByStatus('PENDING').subscribe({
//       next: (data) => {
//         console.log("✅ Crop Listings Fetched:", data);
//         this.pendingListings = data;
//         this.stats.pendingCrops = data.length;
//       },
//       error: (err) => {
//         console.error("❌ Crop Fetch Failed:", err);
//         // Changed 'error' to 'alert' to match your ToastService allowed types
//         this.toast.show('Failed to load crop listings', 'alert');
//       }
//     });

    
//     this.marketService.getAllDocuments().subscribe((data: any[]) => {
//   console.log("🔍 FULL DOCUMENT DATA:", data); // Check the property names in the browser console
//   this.listingsWithDocs = data;
// });

//     // 3. Fetch Farmers
//     this.marketService.getAllFarmers().subscribe({
//       next: (data) => {
//         this.allFarmers = data; // Now matches the HTML *ngFor="let farmer of allFarmers"
//         this.stats.totalFarmersCount = data.length;
//       },
//       error: (err) => console.error("❌ Farmer Fetch Failed:", err)
//     });
//   }

//   setModule(moduleName: 'dashboard' | 'crops' | 'documents' | 'subsidies' | 'farmers') {
//     this.activeModule = moduleName;
//   }

//   // --- Backend Actions ---

 
//   approveCrop(id: number) { 
//   // You can use a prompt to get a reason, or hardcode one for now
//   const reason = prompt("Enter approval remarks:", "Quality standards verified") || "Verified by Officer";
  
//   console.log("📡 Attempting to approve Crop ID:", id);
  
//   // Pass all 3 arguments: id, status, and reason
//   this.marketService.approveCrop(id, 'VALIDATED', reason).subscribe({
//     next: (response) => {
//       console.log('✅ Crop Approved Successfully:', response);
//       this.toast.show('Crop listing approved!', 'success');

//       // Update local UI
//       this.pendingListings = this.pendingListings.filter(item => item.listingId !== id);
//       this.stats.pendingCrops = this.pendingListings.length;

//       // Trigger notification
//   //this.notifService.sendNotification(`Crop Listing #${id} has been Approved!`);
//     },
//     error: (err) => {
//       console.error('❌ Approval failed', err);
//       this.toast.show('Failed to approve crop', 'alert');
//     }
//   });
// }



//   rejectCrop(id: number) {
//   const reason = prompt("Enter rejection reason:", "Quality standards not met");
  
//   if (!reason) return; // Don't proceed if they cancel the prompt

//   // Make sure you are calling the same service method that worked for approval
//   this.marketService.approveCrop(id, 'REJECTED', reason).subscribe({
//     next: (response) => {
//       this.toast.show('Crop listing rejected', 'alert');
//       this.pendingListings = this.pendingListings.filter(item => item.listingId !== id);
//       this.stats.pendingCrops = this.pendingListings.length;

//       //this.notifService.getNotificationsForListing(`Crop Listing #${id} has been Rejected.`);
//     },
//     error: (err) => {
//       console.error('❌ Rejection failed', err);
//       // If you still see 'PUT not supported', check your browser network tab 
//       // to see if it's actually sending a PATCH or a PUT.
//     }
//   });
// }

// // Method for the Approve button
// approveDoc(docId: number) {
//   if (!docId) {
//     console.error("❌ documentId is missing! Still receiving null/undefined.");
//     return;
//   }

//   this.marketService.verifyDocument(docId, 'VERIFIED').subscribe({
//     next: () => {
//       this.toast.show('Document verified successfully!', 'success');
      
//       // Update filter to use 'id' to match the HTML
//       this.listingsWithDocs = this.listingsWithDocs.filter(d => d.id !== docId);
//       this.stats.awaitingDocs = this.listingsWithDocs.length;
//     },
//     error: (err) => {
//       console.error("Verification failed", err);
//       this.toast.show('Backend error: Check logs', 'alert');
//     }
//   });
// }

// rejectDoc(docId: number) {
//   const reason = prompt("Please enter a reason for rejection:");
//   if (!reason || !docId) return;

//   this.marketService.verifyDocument(docId, 'REJECTED').subscribe({
//     next: () => {
//       this.toast.show('Document has been rejected', 'info');
//       this.listingsWithDocs = this.listingsWithDocs.filter(d => d.id !== docId);
//       this.stats.awaitingDocs = this.listingsWithDocs.length;
//     },
//     error: (err) => console.error("Rejection failed", err)
//   });
// }

// // Inside officer-home.ts (around line 186)
// reviewSubsidy(id: number, status: 'COMPLETED' | 'REJECTED') {
//   this.marketService.reviewDisbursement(id, status).subscribe({
//     next: (res: any) => { // Added :any to fix TS7006
//       alert(`Application has been ${status.toLowerCase()}`);
//       this.refreshAllData(); 
//     },
//     error: (err: any) => { // Added :any to fix TS7006
//       console.error('Approval failed', err);
//     }
//   });
// }


//   getFileUrl(doc: any): string {
//     return this.marketService.getFileUrl(doc.fileName);
//   }
// }

import { Component, inject, OnInit, signal } from '@angular/core';
import { MarketService } from '../../../services/market'; 
import { CropListingDTO } from '../../../models/dto.model';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast-service';
import { faCheck, faClose } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { NotificationServiceFarmer } from '../../../services/notification';

@Component({
  selector: 'app-officer-home',
  standalone: true,
  imports: [CommonModule, FaIconComponent],
  templateUrl: './officer-home.html',
  styleUrl: './officer-home.css'
})
export class OfficerHome implements OnInit {
  // Navigation state
  activeModule: 'dashboard' | 'crops' | 'documents' | 'subsidies' | 'farmers' = 'dashboard';

  // FontAwesome Icons
  faCheck = faCheck;
  faClose = faClose;

  // Data Arrays & Signals
  pendingListings: CropListingDTO[] = [];
  listingsWithDocs: any[] = [];
  allFarmers: any[] = []; 
  subsidies = signal<any[]>([]); // Signal for real-time subsidy updates
  
  // Statistics Object for Dashboard counters
  stats = {
    pendingCrops: 0,
    awaitingDocs: 0,
    subsidyApps: 0,
    totalApprovedToday: 0,
    totalFarmersCount: 0
  };

  // Service Injections
  private toast = inject(ToastService);
  
  constructor(
    private marketService: MarketService, 
    private notifService: NotificationServiceFarmer
  ) {}

  ngOnInit(): void {
    console.log("🚀 Officer Portal Initialized!");
    this.refreshAllData(); 
  }

  /**
   * Consolidated data loader to sync with backend services
   */
  refreshAllData(): void {
    console.log("📡 Syncing all backend data...");

    // 1. Fetch Subsidy Disbursements (Crucial fix for your display issue)
    this.marketService.getSubsidies().subscribe({
      next: (data: any[]) => {
        console.log("✅ Subsidies Fetched:", data);
        this.subsidies.set(data);
        // Filter for pending apps to update the dashboard badge
        this.stats.subsidyApps = data.filter(s => s.disbursementStatus === 'PENDING').length;
      },
      error: (err: any) => {
        console.error("❌ Subsidy Fetch Failed:", err);
        this.toast.show('Could not load subsidy applications', 'alert');
      }
    });

    // 2. Fetch Crop Listings
    this.marketService.getListingsByStatus('PENDING').subscribe({
      next: (data: CropListingDTO[]) => {
        console.log("✅ Crop Listings Fetched:", data);
        this.pendingListings = data;
        this.stats.pendingCrops = data.length;
      },
      error: (err: any) => {
        console.error("❌ Crop Fetch Failed:", err);
        this.toast.show('Failed to load crop listings', 'alert');
      }
    });

    // 3. Fetch Document Verification Data
    this.marketService.getAllDocuments().subscribe({
      next: (data: any[]) => {
        console.log("🔍 Documents Fetched:", data);
        this.listingsWithDocs = data;
        this.stats.awaitingDocs = data.filter(d => d.verificationStatus === 'PENDING').length;
      },
      error: (err: any) => console.error("❌ Document Fetch Failed:", err)
    });

    // 4. Fetch Registered Farmers
    this.marketService.getAllFarmers().subscribe({
      next: (data: any[]) => {
        this.allFarmers = data;
        this.stats.totalFarmersCount = data.length;
      },
      error: (err: any) => console.error("❌ Farmer Fetch Failed:", err)
    });
  }

  /**
   * Switches the visible module in the UI
   */
  setModule(moduleName: 'dashboard' | 'crops' | 'documents' | 'subsidies' | 'farmers'): void {
    this.activeModule = moduleName;
  }

  // --- CROP ACTIONS ---

  approveCrop(id: number): void { 
    const reason = prompt("Enter approval remarks:", "Quality standards verified") || "Verified by Officer";
    
    this.marketService.approveCrop(id, 'VALIDATED', reason).subscribe({
      next: (response: any) => {
        this.toast.show('Crop listing approved!', 'success');
        this.refreshAllData(); // Refresh all stats and lists
      },
      error: (err: any) => {
        console.error('❌ Approval failed', err);
        this.toast.show('Failed to approve crop', 'alert');
      }
    });
  }

  rejectCrop(id: number): void {
    const reason = prompt("Enter rejection reason:", "Quality standards not met");
    if (!reason) return;

    this.marketService.approveCrop(id, 'REJECTED', reason).subscribe({
      next: (response: any) => {
        this.toast.show('Crop listing rejected', 'alert');
        this.refreshAllData();
      },
      error: (err: any) => console.error('❌ Rejection failed', err)
    });
  }

  // --- DOCUMENT ACTIONS ---

  approveDoc(docId: number): void {
    if (!docId) return;

    this.marketService.verifyDocument(docId, 'VERIFIED').subscribe({
      next: () => {
        this.toast.show('Document verified successfully!', 'success');
        this.refreshAllData();
      },
      error: (err: any) => {
        console.error("Verification failed", err);
        this.toast.show('Backend error updating document', 'alert');
      }
    });
  }

  rejectDoc(docId: number): void {
    const reason = prompt("Please enter a reason for rejection:");
    if (!reason || !docId) return;

    this.marketService.verifyDocument(docId, 'REJECTED').subscribe({
      next: () => {
        this.toast.show('Document has been rejected', 'info');
        this.refreshAllData();
      },
      error: (err: any) => console.error("Rejection failed", err)
    });
  }

  // --- SUBSIDY ACTIONS ---

  /**
   * Handles Officer approval/rejection of a farmer's subsidy request.
   * Maps to DisbursementStatus: COMPLETED or REJECTED.
   */
  reviewSubsidy(id: number, status: 'COMPLETED' | 'REJECTED'): void {
    this.marketService.reviewDisbursement(id, status).subscribe({
      next: (res: any) => {
        alert(`Disbursement ${id} has been marked as ${status.toLowerCase()}`);
        this.refreshAllData(); // Syncs budget updates and status changes
      },
      error: (err: any) => {
        console.error('Subsidy review failed', err);
        // Error could be "Insufficient Budget" from your backend logic
        this.toast.show(err.error?.message || 'Approval failed', 'alert');
      }
    });
  }

  // Helper for document viewing
  getFileUrl(doc: any): string {
    return this.marketService.getFileUrl(doc.fileName);
  }
}