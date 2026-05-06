import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuditService } from '../../../services/audit.service'; // Adjust path as needed

@Component({
  selector: 'app-auditor-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './auditor-home.html',
  styleUrl: './auditor-home.css'
})
export class AuditorHome implements OnInit {
  // Use inject() or constructor injection
  private auditService = inject(AuditService);

  // Variables to hold your summary data
  stats = {
    totalAudits: 0,
    pendingCompliance: 0,
    lastAuditDate: 'N/A'
  };

  ngOnInit(): void {
    this.loadSummaryData();
  }

  loadSummaryData() {
    this.auditService.getAuditStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (err) => {
        console.error('Failed to load dashboard stats', err);
      }
    });
  }
}