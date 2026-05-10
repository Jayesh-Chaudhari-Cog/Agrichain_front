// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-farmer-listings',
//   imports: [],
//   templateUrl: './farmer-listings.html',
//   styleUrl: './farmer-listings.css',
// })
// export class FarmerListings {}

import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-farmer-listings',
  imports: [],
  templateUrl: './farmer-listings.html',
  styleUrl: './farmer-listings.css',
})
export class FarmerListings implements OnInit {
  private http = inject(HttpClient);
  
  // Replace this with the actual logged-in user ID from your AuthService
  currentFarmerId = 9; 
  
  myListings = signal<any[]>([]);

  ngOnInit() {
    this.fetchMyListings();
  }

  fetchMyListings() {
    this.http.get<any[]>(`http://localhost:8090/market/listings/farmer/${this.currentFarmerId}`)
      .subscribe(data => {
        this.myListings.set(data);
      });
  }
}