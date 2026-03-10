import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeedsResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class FeedService {
  constructor(private http: HttpClient) {}

  getFeeds(category: string = 'all', limit: number = 50, source?: string): Observable<FeedsResponse> {
    let params = new HttpParams().set('limit', limit.toString());
    if (category && category !== 'all') params = params.set('category', category);
    if (source) params = params.set('source', source);
    return this.http.get<FeedsResponse>('/api/feeds', { params });
  }
}
