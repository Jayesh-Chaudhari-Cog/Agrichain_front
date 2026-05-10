import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-farmer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './farmer-dashboard.html',
  styleUrl: './farmer-dashboard.css'
})
export class FarmerDashboardPage implements OnInit {
  private authService = inject(AuthService);

  // Profile Information - Reactive signals
  farmerName = signal('Farmer');
  status = signal('VERIFIED');

  // Dashboard Statistics
  listedCropsCount = signal(5);
  totalEarnings = signal(45200.50);
  activeAlerts = signal(3);

  activeTab = signal('dashboard');

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

  onAddCrop() { console.log("Navigating to Crop Listing Form..."); }
  onApplySubsidy() { console.log("Opening Subsidy Program List..."); }
}
