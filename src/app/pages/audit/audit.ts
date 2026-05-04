import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuditService } from '../../services/audit.service';
import { AuditDTO, AuditScope, AuditStatus } from '../../models/audit.model';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit.html',
  styleUrl: './audit.css'
})
export class AuditComponent implements OnInit {
  audits: AuditDTO[] = [];
  
  // Initialize form with default values
  newAudit: AuditDTO = {
    officerId: 101, // Mock ID: Replace with actual logic later
    scope: AuditScope.PROGRAM,
    findings: '',
    date: new Date().toISOString().split('T')[0],
    status: AuditStatus.OPEN
  };

  // Enums for dropdown menus
  scopes = Object.values(AuditScope);
  statuses = Object.values(AuditStatus);

  constructor(private auditService: AuditService) {}

  ngOnInit(): void {
    this.loadAudits();
  }

  loadAudits(): void {
    this.auditService.getAllAudits().subscribe({
      next: (data) => this.audits = data,
      error: (err) => console.error('Error fetching audits:', err)
    });
  }

  onSubmit(): void {
    this.auditService.createAudit(this.newAudit).subscribe({
      next: (res) => {
        console.log('Audit created successfully');
        this.loadAudits(); // Refresh the table
        this.resetForm();
      },
      error: (err) => alert('Failed to create audit. Check console for details.')
    });
  }

  resetForm() {
    this.newAudit = {
      officerId: 101,
      scope: AuditScope.PROGRAM,
      findings: '',
      date: new Date().toISOString().split('T')[0],
      status: AuditStatus.OPEN
    };
  }
}