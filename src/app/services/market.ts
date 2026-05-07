// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { CropListingStatus } from '../models/enum.model';
// import { CropListingDTO, OrderDTO } from '../models/dto.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class MarketService {
//   private baseUrl = 'http://localhost:8080/market'; // Update with your actual backend URL

//   constructor(private http: HttpClient) { }

//   // 1. Get Listings by Status (Used by Officer to see PENDING)
//   getListingsByStatus(status: string): Observable<CropListingDTO[]> {
//     return this.http.get<CropListingDTO[]>(`${this.baseUrl}/listings/status/${status}`);
//   }

//   // 2. Validate Listing (The Officer "Approve" button)
//   validateListing(id: number): Observable<CropListingDTO> {
//     return this.http.put<CropListingDTO>(`${this.baseUrl}/listings/validate/${id}`, {});
//   }

//   // 3. Create a new Listing
//   createListing(listing: CropListingDTO): Observable<CropListingDTO> {
//     return this.http.post<CropListingDTO>(`${this.baseUrl}/createlisting`, listing);
//   }

//   // 4. Place an Order
//   placeOrder(order: OrderDTO): Observable<OrderDTO> {
//     return this.http.post<OrderDTO>(`${this.baseUrl}/placeorder`, order);
//   }

//   // 5. Reduce Quantity (Atomic update)
//   reduceQuantity(listingId: number, quantity: number): Observable<void> {
//     const params = new HttpParams().set('quantity', quantity.toString());
//     return this.http.put<void>(`${this.baseUrl}/listings/${listingId}/reduce-quantity`, {}, { params });
//   }

//   // 6. Get all Orders for a specific Trader
//   getOrdersByTrader(traderId: number): Observable<OrderDTO[]> {
//     return this.http.get<OrderDTO[]>(`${this.baseUrl}/orders/trader/${traderId}`);
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CropListingDTO } from '../models/dto.model';

@Injectable({
  providedIn: 'root'
})
export class MarketService {
  // Update: Using port 8090 and adding the /market prefix for Gateway routing
  private apiUrl = 'http://localhost:8090/market'; 

  constructor(private http: HttpClient) {}

  // 1. Crop Listings
  getListingsByStatus(status: string): Observable<CropListingDTO[]> {
    return this.http.get<CropListingDTO[]>(`${this.apiUrl}/listings/status/${status}`);
  }

  validateListing(id: number, status: string, comment: string = ''): Observable<any> {
    // Matches: http://localhost:8090/market/listings/{id}/validate
    return this.http.put(`${this.apiUrl}/listings/validate/${id}`, { status, comment });
  }

  // 2. Documents
  getPendingDocuments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/documents/pending`);
  }

  verifyDocument(docId: number, status: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/documents/${docId}/verify`, { status });
  }

  // 3. Subsidies
  getPendingSubsidies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/subsidies/pending`);
  }

  // 4. Farmers
  getAllFarmers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/farmers/all`);
  }
}