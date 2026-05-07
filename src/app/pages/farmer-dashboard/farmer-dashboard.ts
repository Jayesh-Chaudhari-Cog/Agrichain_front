import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-farmer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './farmer-dashboard.html',
  styleUrl: './farmer-dashboard.css'
})
export class FarmerDashboardPage {
  // Profile Information
  farmerName = signal('Janvi');
  status = signal('VERIFIED'); // PENDING, VERIFIED, REJECTED
  
  // Dashboard Statistics
  listedCropsCount = signal(5);
  totalEarnings = signal(45200.50);
  activeAlerts = signal(3);

  // Active Tab for Sidebar Navigation
  activeTab = signal('dashboard');

  // Mock data for "Recent Listings" based on CropListing entity
  recentListings = signal([
    { id: 'L001', crop: 'Wheat', quantity: '500kg', price: '₹12,000', status: 'Approved' },
    { id: 'L002', crop: 'Rice', quantity: '200kg', price: '₹8,500', status: 'Pending' },
    { id: 'L003', crop: 'Corn', quantity: '150kg', price: '₹4,200', status: 'Sold' }
  ]);

  setActiveTab(tab: string) {
    this.activeTab.set(tab);
  }

  onAddCrop() {
    console.log("Navigating to Crop Listing Form...");
  }

  onApplySubsidy() {
    console.log("Opening Subsidy Program List...");
  }
}