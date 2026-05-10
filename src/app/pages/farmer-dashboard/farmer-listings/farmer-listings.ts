import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-farmer-listings',
  imports: [CommonModule],
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

// import { Component, OnInit, inject, signal } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../../../services/auth-service';

// @Component({
//   selector: 'app-farmer-listings',
//   standalone: true, 
//   imports: [CommonModule],
//   templateUrl: './farmer-listings.html',
//   styleUrl: './farmer-listings.css',
// })
// export class FarmerListings implements OnInit {
//   private http = inject(HttpClient);
//   private authService = inject(AuthService);
  
//   myListings = signal<any[]>([]);

//   ngOnInit() {
//     this.fetchMyListings();
//   }

//   fetchMyListings() {
//     // Access the signal value by calling it like a function ()
//     // Use optional chaining (?.) because currentUser could be null
//     const user = this.authService.currentUser();
//     const currentFarmerId = user?.id; 

//     if (currentFarmerId) {
//       this.http.get<any[]>(`http://localhost:8090/market/listings/farmer/${currentFarmerId}`)
//         .subscribe({
//           next: (data) => {
//             this.myListings.set(data);
//           },
//           error: (err) => {
//             console.error("Failed to load listings:", err);
//           }
//         });
//     } else {
//       console.error("No logged-in user found in AuthService signals!");
//     }
//   }
// }