import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MapEventsResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class MapEventsService {
  constructor(private http: HttpClient) {}

  getMapEvents(type?: string, severity?: string, since?: string): Observable<MapEventsResponse> {
    let params = new HttpParams();
    if (type) params = params.set('type', type);
    if (severity) params = params.set('severity', severity);
    if (since) params = params.set('since', since);
    return this.http.get<MapEventsResponse>('/api/map-events', { params });
  }
}
