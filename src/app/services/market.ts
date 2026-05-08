import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarketService {
  private gatewayUrl = 'http://localhost:8090'; 

  constructor(private http: HttpClient) {}

  // 1. Listings (Updated to accept status and reason to fix TS2554)
  getListingsByStatus(status: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.gatewayUrl}/market/listings/status/${status}`);
  }

  validateListing(id: number, status: string = 'APPROVED', comment: string = ''): Observable<any> {
    // This now accepts up to 3 arguments to satisfy your OfficerHome calls
    return this.http.put(`${this.gatewayUrl}/market/listings/validate/${id}`, { status, comment });
  }

  // 2. Documents (Added these back to fix OfficerHome errors)
  getAllDocuments(): Observable<any[]> {
  // Use the direct path that the Registration Service expects
  // Path: http://localhost:8090/documents/all
  return this.http.get<any[]>(`${this.gatewayUrl}/documents/all`);
}

  getPendingDocuments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.gatewayUrl}/documents/all`); // or specific pending endpoint
  }

  // verifyDocument(documentId: number, status: string): Observable<any> {
  //   const params = new HttpParams().set('status', status);
  //   return this.http.patch(`${this.gatewayUrl}/documents/${documentId}/verify`, null, { params });
  // }

  verifyDocument(id: number, status: string): Observable<any> {
  // Ensure the URL matches your Backend @PutMapping or @PostMapping
  return this.http.patch(`${this.gatewayUrl}/documents/${id}/verify?status=${status}`, {});
}

  getFileUrl(fileName: string): string {
    return `${this.gatewayUrl}/documents/files/${fileName}`;
  }

  // Make sure this method exists
getAllFarmers(): Observable<any[]> {
  return this.http.get<any[]>(`${this.gatewayUrl}/farmers`);
}


// inside market.ts
getAllLogs(): Observable<any[]> {
  // Replace with your actual backend URL later
  return this.http.get<any[]>(`${this.gatewayUrl}/market/audit-logs`);
}

// inside market.ts
// inside market.ts
approveCrop(id: number, status: string, reason: string): Observable<any> {
  // Use .patch to match your backend @PatchMapping
  return this.http.patch(`${this.gatewayUrl}/market/listings/validate/${id}`, null, {
    params: {
      status: status,
      reason: reason
    }
  });
}

// Double check that your getPendingDocuments is also there
// getPendingDocuments(): Observable<any[]> {
//   return this.http.get<any[]>(`${this.gatewayUrl}/documents/all`);
// }

  // 3. Subsidies (Added to fix OfficerHome errors)
  // inside market.ts

// 1. Fetching the list
// getPendingSubsidies(): Observable<any[]> {
//   // Ensure this matches your @RequestMapping on the Disbursement Controller
//   // Usually, you'd want a specific endpoint for 'PENDING' status
//   return this.http.get<any[]>(`${this.gatewayUrl}/disbursements/pending`);
// }

// 2. Reviewing (Approving/Rejecting)
// Matches Java: @PatchMapping("/{id}/review") with @RequestParam DisbursementStatus status
reviewSubisdy(id: number, status: string): Observable<any> {
  const params = new HttpParams().set('status', status);
  
  // Note: We send 'null' as the body because the data is in the @RequestParam
  return this.http.patch(`${this.gatewayUrl}/disbursements/${id}/review`, null, { params });
}
}