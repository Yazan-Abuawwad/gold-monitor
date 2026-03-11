import {
  Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MapEventsService } from '../../services/map-events.service';
import { MapEvent } from '../../models';
import { Subscription } from 'rxjs';
import * as L from 'leaflet';

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#ff2222',
  high: '#ff6600',
  medium: '#ffaa00',
  low: '#44bb44',
};

const SEVERITY_RADIUS: Record<string, number> = {
  critical: 12,
  high: 10,
  medium: 8,
  low: 6,
};

@Component({
  selector: 'app-map-panel',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './map-panel.component.html',
  styleUrls: ['./map-panel.component.css']
})
export class MapPanelComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  data: { events: MapEvent[] } | null = null;
  loading = true;
  error: string | null = null;

  private map: L.Map | null = null;
  private markers: L.CircleMarker[] = [];
  private sub: Subscription | null = null;

  severityEntries = Object.entries(SEVERITY_COLORS);

  constructor(private mapEventsService: MapEventsService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
    this.loadEvents();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.map?.remove();
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [20, 15],
      zoom: 2,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: ['a', 'b', 'c', 'd'],
      maxZoom: 19,
    }).addTo(this.map);

    setTimeout(() => this.map?.invalidateSize(), 100);
  }

  loadEvents(): void {
    this.sub?.unsubscribe();
    this.loading = true;
    this.sub = this.mapEventsService.getMapEvents().subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;
        this.error = null;
        this.renderMarkers(res.events);
      },
      error: (err) => {
        this.error = err.message || 'Failed to fetch map events';
        this.loading = false;
      }
    });
  }

  private renderMarkers(events: MapEvent[]): void {
    // Clear existing markers
    this.markers.forEach(m => m.remove());
    this.markers = [];

    events.forEach(event => {
      const color = SEVERITY_COLORS[event.severity] || '#ffaa00';
      const radius = SEVERITY_RADIUS[event.severity] || 8;
      const marker = L.circleMarker([event.lat, event.lng], {
        color,
        fillColor: color,
        fillOpacity: 0.7,
        weight: event.severity === 'critical' ? 3 : 2,
        radius,
      });

      marker.bindPopup(this.buildPopupHtml(event));
      if (this.map) marker.addTo(this.map);
      this.markers.push(marker);
    });
  }

  private buildPopupHtml(event: MapEvent): string {
    const color = SEVERITY_COLORS[event.severity] || '#ffaa00';
    const timeAgo = this.timeAgo(event.occurredAt);
    return `
      <div style="background:#1a1a1a;color:#e8e8e8;min-width:200px;font-family:'Courier New',monospace;font-size:12px;">
        <div style="color:${color};font-weight:bold;margin-bottom:6px;font-size:13px;">${event.title}</div>
        <p style="margin:0 0 8px;color:#aaa;line-height:1.4;">${event.description}</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <span style="background:${color}33;color:${color};padding:2px 8px;border-radius:2px;font-size:11px;">${event.type.toUpperCase()}</span>
          <span style="background:#333;color:${color};padding:2px 8px;border-radius:2px;font-size:11px;">${event.severity.toUpperCase()}</span>
        </div>
        <div style="color:#666;font-size:11px;margin-top:6px;">${timeAgo} · ${event.source}</div>
      </div>`;
  }

  private timeAgo(ts: string): string {
    const diff = Date.now() - new Date(ts).getTime();
    const days = Math.floor(diff / 86400000);
    if (days > 0) return `${days}d ago`;
    const hrs = Math.floor(diff / 3600000);
    if (hrs > 0) return `${hrs}h ago`;
    return 'recently';
  }

  get eventCount(): number {
    return this.data?.events?.length ?? 0;
  }
}
