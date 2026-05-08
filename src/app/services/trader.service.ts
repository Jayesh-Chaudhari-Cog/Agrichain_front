// trader.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TraderStats {
  label: string;
  value: string | number;
  icon: string;
  bg: string;
}

@Injectable({ providedIn: 'root' })
export class TraderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/trader'; // Your Spring Boot URL

  getDashboardStats(): Observable<TraderStats[]> {
    return this.http.get<TraderStats[]>(`${this.apiUrl}/stats`);
  }

  getSessionDetails(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/session`);
  }
}