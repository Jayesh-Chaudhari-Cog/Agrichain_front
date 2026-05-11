
// import { Component, signal, inject, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http'; // Added for API
// import { FormsModule } from '@angular/forms'; // Added for [(ngModel)]
// import { AuthService } from '../../../services/auth-service';

// @Component({
//   selector: 'app-farmer-dashboard',
//   standalone: true,
//   imports: [CommonModule, FormsModule], // Added FormsModule
//   templateUrl: './farmer-dashboard.html',
//   styleUrl: './farmer-dashboard.css'
// })
// export class FarmerDashboardPage implements OnInit {
//   private authService = inject(AuthService);
//   private http = inject(HttpClient); // Injected HttpClient

//   // Profile Information - Reactive signals
//   farmerName = signal('Farmer');
//   status = signal('VERIFIED');

//   // Dashboard Statistics
//   listedCropsCount = signal(5);
//   totalEarnings = signal(45200.50);
//   activeAlerts = signal(3);

//   activeTab = signal('dashboard');

//   // --- NEW: Add Crop Form Logic ---
//   showAddForm = signal(false); 
//   newCrop = {
//     cropType: '',
//     quantity: 0,
//     price: 0,
//     location: ''
//   };

//   recentListings = signal([
//     { id: 'L001', crop: 'Wheat', quantity: '500kg', price: '₹12,000', status: 'Approved' },
//     { id: 'L002', crop: 'Rice', quantity: '200kg', price: '₹8,500', status: 'Pending' },
//     { id: 'L003', crop: 'Corn', quantity: '150kg', price: '₹4,200', status: 'Sold' }
//   ]);

//   ngOnInit() {
//     const user = this.authService.currentUser();
//     if (user) {
//       // Set the name from the logged-in user object
//       this.farmerName.set(user.name || user.email);
//     }
//   }

//   setActiveTab(tab: string) {
//     this.activeTab.set(tab);
//   }

//   // --- UPDATED ACTIONS ---
//   onAddCrop() { 
//     this.showAddForm.set(true); 
//   }

//   onApplySubsidy() { console.log("Opening Subsidy Program List..."); }

//   submitCrop() {
//     const user = this.authService.currentUser();
    
//     if (!user || !user.id) {
//       alert("Please log in first!");
//       return;
//     }

//     const payload = {
//       ...this.newCrop,
//       farmerId: user.id // Uses logged-in ID
//     };

//     // Calling your @PostMapping("/createlisting") endpoint
//     this.http.post('http://localhost:8090/market/createlisting', payload)
//       .subscribe({
//         next: (res) => {
//           alert("Crop listed successfully! Status is PENDING.");
//           this.showAddForm.set(false);
//           this.newCrop = { cropType: '', quantity: 0, price: 0, location: '' }; // Reset
//         },
//         error: (err) => {
//           console.error("Listing failed", err);
//           alert("Error: Check if Farmer Microservice is running.");
//         }
//       });
//   }
// }


import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth-service';
import { FarmerSubsidy } from '../farmer-subsidy/farmer-subsidy';

// Interface to match your Backend CropListingDTO
interface CropListing {
  listingId?: number | string;
  cropType: string;
  quantity: number;
  price: number;
  location: string;
  status: string;
}

@Component({
  selector: 'app-farmer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, FarmerSubsidy],
  templateUrl: './farmer-dashboard.html',
  styleUrl: './farmer-dashboard.css'
})
export class FarmerDashboardPage implements OnInit {
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  // Profile Information - Reactive signals
  farmerName = signal('Farmer');
  status = signal('VERIFIED');

  // Dashboard Statistics
  listedCropsCount = signal(0); // Set to 0 to be updated by backend
  totalEarnings = signal(45200.50);
  activeAlerts = signal(3);

  activeTab = signal('dashboard');

  // --- NEW: Add Crop Form Logic ---
  showAddForm = signal(false); 
  newCrop = {
    cropType: '',
    quantity: 0,
    price: 0,
    location: ''
  };

  // Listings now holds dynamic data from the database
  recentListings = signal<CropListing[]>([]);

  ngOnInit() {
    this.loadFarmerData();
  }

  /**
   * Fetches data for the specific logged-in user
   */
  loadFarmerData() {
    const user = this.authService.currentUser();
    if (user) {
      this.farmerName.set(user.name || user.email);

      // Fetch listings filtered by the unique farmer ID
      if (user.id) {
        this.http.get<CropListing[]>(`http://localhost:8090/market/listings/farmer/${user.id}`)
          .subscribe({
            next: (data) => {
              this.recentListings.set(data);
              this.listedCropsCount.set(data.length); // Update total count dynamically
            },
            error: (err) => {
              console.error("Failed to load listings:", err);
            }
          });
      }
    }
  }

  setActiveTab(tab: string) {
    this.activeTab.set(tab);
  }

  onAddCrop() { 
    this.showAddForm.set(true); 
  }

  onApplySubsidy() { 
    this.setActiveTab('subsidies');
  }

  submitCrop() {
    const user = this.authService.currentUser();
    
    if (!user || !user.id) {
      alert("Please log in first!");
      return;
    }

    const payload = {
      ...this.newCrop,
      farmerId: user.id // Links listing to Harini's account
    };

    this.http.post('http://localhost:8090/market/createlisting', payload)
      .subscribe({
        next: (res) => {
          alert("Crop listed successfully!");
          this.showAddForm.set(false);
          this.newCrop = { cropType: '', quantity: 0, price: 0, location: '' }; 
          
          // REFRESH the list immediately after adding a new crop
          this.loadFarmerData(); 
        },
        error: (err) => {
          console.error("Listing failed", err);
          alert("Error: Check if your Market Microservice is running.");
        }
      });
  }
}