import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-farmer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './farmer-dashboard.html',
  styleUrl: './farmer-dashboard.css'
})
export class FarmerDashboardPage implements OnInit {
  private http = inject(HttpClient); // Properly injecting HttpClient
  
  farmerName = signal('Janvi');
  farmerId = 1; // Assuming Janvi's ID is 1
  status = signal('PENDING'); 

  notifications = signal<any[]>([]);

  ngOnInit() {
    // When the page loads, check for updates
    this.checkAllNotifications();
  }

  checkAllNotifications() {
    // We call the backend to get logs where action is 'NOTIFICATION' 
    // and relates to this farmer's listings
    this.http.get<any[]>(`http://localhost:8080/market/audit-logs`)
      .subscribe((allLogs: any[]) => {
        // Filter logs locally to find NOTIFICATIONS for this specific farmer
        // Note: In a real app, the backend would filter this for you
        const myUpdates = allLogs.filter(log => 
          log.action === 'NOTIFICATION' && log.reason.includes(`ID: ${this.farmerId}`)
        );

        this.notifications.set(myUpdates);

        if (myUpdates.length > 0) {
          console.log("New updates found for Janvi!");
        }
      });
  }

  // If you have a specific Listing ID you want to check
  loadNotifications(listingId: number) {
    this.http.get(`http://localhost:8080/market/notifications/${listingId}`)
      .subscribe((data: any) => {
        if(data.length > 0) {
          alert("New Update: " + data[0].reason);
        }
      });
  }
}