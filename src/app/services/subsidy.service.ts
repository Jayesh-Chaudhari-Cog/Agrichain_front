import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubsidyProgram, SubsidyProgramCreateRequest, SubsidyProgramUpdateRequest } from '../models/subsidy.model';
import { API_URL } from '../elements/constants';

@Injectable({ providedIn: 'root' })
export class SubsidyService {
  private http = inject(HttpClient);
  private apiUrl = `${API_URL}subsidy-programs`;

  /**
   * Fetch all subsidy programs
   */
  getAllPrograms(): Observable<SubsidyProgram[]> {
    return this.http.get<SubsidyProgram[]>(`${this.apiUrl}`);
  }

  /**
   * Create a new subsidy program
   */
  createProgram(program: SubsidyProgramCreateRequest): Observable<SubsidyProgram> {
    return this.http.post<SubsidyProgram>(`${this.apiUrl}`, program);
  }

  /**
   * Update an existing subsidy program
   */
  updateProgram(program: SubsidyProgramUpdateRequest): Observable<SubsidyProgram> {
    return this.http.put<SubsidyProgram>(`${this.apiUrl}/${program.programID}`, program);
  }

  /**
   * Delete a subsidy program
   */
  deleteProgram(programID: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${programID}`);
  }
}
