// import { Component, signal, inject, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../../../services/auth-service';

// @Component({
//   selector: 'app-farmer-dashboard',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './farmer-dashboard.html',
//   styleUrl: './farmer-dashboard.css'
// })
// export class FarmerDashboardPage implements OnInit {
//   private authService = inject(AuthService);

//   // Profile Information - Reactive signals
//   farmerName = signal('Farmer');
//   status = signal('VERIFIED');

//   // Dashboard Statistics
//   listedCropsCount = signal(5);
//   totalEarnings = signal(45200.50);
//   activeAlerts = signal(3);

//   activeTab = signal('dashboard');

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

//   onAddCrop() { console.log("Navigating to Crop Listing Form..."); }
//   onApplySubsidy() { console.log("Opening Subsidy Program List..."); }
// }


import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; // Added for API
import { FormsModule } from '@angular/forms'; // Added for [(ngModel)]
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-farmer-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule], // Added FormsModule
  templateUrl: './farmer-dashboard.html',
  styleUrl: './farmer-dashboard.css'
})
export class FarmerDashboardPage implements OnInit {
  private authService = inject(AuthService);
  private http = inject(HttpClient); // Injected HttpClient

  // Profile Information - Reactive signals
  farmerName = signal('Farmer');
  status = signal('VERIFIED');

  // Dashboard Statistics
  listedCropsCount = signal(5);
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

  recentListings = signal([
    { id: 'L001', crop: 'Wheat', quantity: '500kg', price: '₹12,000', status: 'Approved' },
    { id: 'L002', crop: 'Rice', quantity: '200kg', price: '₹8,500', status: 'Pending' },
    { id: 'L003', crop: 'Corn', quantity: '150kg', price: '₹4,200', status: 'Sold' }
  ]);

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      // Set the name from the logged-in user object
      this.farmerName.set(user.name || user.email);
    }
  }

  setActiveTab(tab: string) {
    this.activeTab.set(tab);
  }

  // --- UPDATED ACTIONS ---
  onAddCrop() { 
    this.showAddForm.set(true); 
  }

  onApplySubsidy() { console.log("Opening Subsidy Program List..."); }

  submitCrop() {
    const user = this.authService.currentUser();
    
    if (!user || !user.id) {
      alert("Please log in first!");
      return;
    }

    const payload = {
      ...this.newCrop,
      farmerId: user.id // Uses logged-in ID
    };

    // Calling your @PostMapping("/createlisting") endpoint
    this.http.post('http://localhost:8090/market/createlisting', payload)
      .subscribe({
        next: (res) => {
          alert("Crop listed successfully! Status is PENDING.");
          this.showAddForm.set(false);
          this.newCrop = { cropType: '', quantity: 0, price: 0, location: '' }; // Reset
        },
        error: (err) => {
          console.error("Listing failed", err);
          alert("Error: Check if Farmer Microservice is running.");
        }
      });
  }
}