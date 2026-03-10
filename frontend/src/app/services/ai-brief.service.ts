import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AiBriefResponse } from '../models';

export interface AiBriefRequest {
  briefType: string;
  headlines: string[];
}

@Injectable({ providedIn: 'root' })
export class AiBriefService {
  constructor(private http: HttpClient) {}

  generateBrief(briefType: string, headlines: string[]): Observable<AiBriefResponse> {
    const body: AiBriefRequest = { briefType, headlines };
    return this.http.post<AiBriefResponse>('/api/ai-brief', body);
  }
}
