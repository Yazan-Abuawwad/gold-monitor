import {
  Component, OnInit, OnDestroy, Input, Output, EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FeedService } from '../../services/feed.service';
import { FeedItem, FeedsResponse } from '../../models';
import { Subscription, interval } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';

const CATEGORIES = ['all', 'world', 'security'];

@Component({
  selector: 'app-news-panel',
  standalone: true,
  imports: [
    CommonModule, ButtonModule, ScrollPanelModule, TagModule, ProgressSpinnerModule
  ],
  templateUrl: './news-panel.component.html',
  styleUrls: ['./news-panel.component.css']
})
export class NewsPanelComponent implements OnInit, OnDestroy {
  @Input() refreshIntervalMs = 60000;
  @Output() headlinesLoaded = new EventEmitter<string[]>();

  categories = CATEGORIES;
  selectedCategory = 'all';
  data: FeedsResponse | null = null;
  loading = true;
  error: string | null = null;

  private sub: Subscription | null = null;
  private refreshSub: Subscription | null = null;

  constructor(private feedService: FeedService) {}

  ngOnInit(): void {
    this.loadFeeds();
    this.refreshSub = interval(this.refreshIntervalMs).subscribe(() => this.loadFeeds());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.refreshSub?.unsubscribe();
  }

  selectCategory(cat: string): void {
    this.selectedCategory = cat;
    this.loadFeeds();
  }

  loadFeeds(): void {
    // Cancel any in-flight request before starting a new one to prevent overlap
    this.sub?.unsubscribe();
    this.loading = true;
    this.sub = this.feedService.getFeeds(this.selectedCategory).subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;
        this.error = null;
        this.headlinesLoaded.emit(res.items.slice(0, 20).map(i => i.title));
      },
      error: (err) => {
        this.error = err.message || 'Failed to fetch feeds';
        this.loading = false;
      }
    });
  }

  groupedBySource(): { source: string; items: FeedItem[] }[] {
    if (!this.data?.items) return [];
    const map = new Map<string, FeedItem[]>();
    for (const item of this.data.items) {
      const key = item.source.name;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries()).map(([source, items]) => ({ source, items: items.slice(0, 4) }));
  }

  timeAgo(ts: string | null): string {
    if (!ts) return '';
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  severityClass(category: string): string {
    return category === 'security' ? 'severity-high' : 'severity-medium';
  }

  get footerText(): string {
    if (!this.data) return '';
    const interval = this.refreshIntervalMs >= 60000
      ? `${Math.round(this.refreshIntervalMs / 60000)}m`
      : `${this.refreshIntervalMs / 1000}s`;
    return `${this.data.items.length} items · ${this.data.sources.length} sources · refreshes every ${interval}`;
  }
}
