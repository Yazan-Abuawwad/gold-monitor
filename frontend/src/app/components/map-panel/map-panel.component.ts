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

interface GoldMine {
  name: string;
  country: string;
  operator: string;
  annualOz: string;
  lat: number;
  lng: number;
}

const GOLD_MINES: GoldMine[] = [
  { name: 'Nevada Gold Mines (Carlin)', country: 'USA', operator: 'Barrick / Newmont', annualOz: '3.5M oz', lat: 40.73, lng: -116.47 },
  { name: 'Muruntau', country: 'Uzbekistan', operator: 'Navoi Mining', annualOz: '2.6M oz', lat: 41.52, lng: 62.17 },
  { name: 'Grasberg', country: 'Indonesia', operator: 'Freeport-McMoRan', annualOz: '1.4M oz', lat: -4.05, lng: 137.12 },
  { name: 'Kibali', country: 'DRC', operator: 'Barrick Gold', annualOz: '0.8M oz', lat: 3.01, lng: 29.62 },
  { name: 'Olympiada', country: 'Russia', operator: 'Polyus', annualOz: '1.5M oz', lat: 59.37, lng: 93.31 },
  { name: 'Sukhoi Log', country: 'Russia', operator: 'Polyus (dev)', annualOz: '2.3M oz est.', lat: 58.38, lng: 112.78 },
  { name: 'Boddington', country: 'Australia', operator: 'Newmont', annualOz: '0.7M oz', lat: -32.59, lng: 116.36 },
  { name: 'Pueblo Viejo', country: 'Dominican Republic', operator: 'Barrick / Newmont', annualOz: '0.8M oz', lat: 18.78, lng: -70.11 },
  { name: 'Lihir', country: 'Papua New Guinea', operator: 'Newcrest', annualOz: '1.0M oz', lat: -3.12, lng: 152.64 },
  { name: 'Cortez', country: 'USA', operator: 'Nevada Gold Mines', annualOz: '0.9M oz', lat: 40.37, lng: -116.93 },
  { name: 'Peñasquito', country: 'Mexico', operator: 'Newmont', annualOz: '0.6M oz', lat: 24.90, lng: -102.31 },
  { name: 'Oyu Tolgoi', country: 'Mongolia', operator: 'Rio Tinto / Turquoise Hill', annualOz: '0.5M oz', lat: 43.00, lng: 107.00 },
  { name: 'Ahafo', country: 'Ghana', operator: 'Newmont', annualOz: '0.7M oz', lat: 7.02, lng: -2.16 },
  { name: 'Loulo-Gounkoto', country: 'Mali', operator: 'Barrick Gold', annualOz: '0.7M oz', lat: 14.80, lng: -11.40 },
  { name: 'South Deep', country: 'South Africa', operator: 'Gold Fields', annualOz: '0.3M oz', lat: -26.43, lng: 27.52 },
  { name: 'Kumtor', country: 'Kyrgyzstan', operator: 'Centerra Gold', annualOz: '0.5M oz', lat: 41.85, lng: 78.18 },
  { name: 'Yanacocha', country: 'Peru', operator: 'Newmont', annualOz: '0.5M oz', lat: -6.93, lng: -78.65 },
  { name: 'Cerro Negro', country: 'Argentina', operator: 'Newmont', annualOz: '0.4M oz', lat: -46.75, lng: -67.56 },
  { name: 'Mponeng', country: 'South Africa', operator: 'AngloGold Ashanti', annualOz: '0.5M oz', lat: -26.44, lng: 27.41 },
  { name: 'Tropicana', country: 'Australia', operator: 'AngloGold Ashanti', annualOz: '0.4M oz', lat: -28.67, lng: 124.74 },
];

const MAP_TILES: Record<string, { label: string; url: string; attribution: string; subdomains?: string[]; maxZoom: number }> = {
  DARK:      { label: 'DARK',  url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>', subdomains: ['a','b','c','d'], maxZoom: 19 },
  LIGHT:     { label: 'LIGHT', url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>', subdomains: ['a','b','c','d'], maxZoom: 19 },
  OSM:       { label: 'OSM',   url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>', maxZoom: 19 },
  SATELLITE: { label: 'SAT',   url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution: '&copy; Esri &mdash; Source: Esri, USGS, NOAA', maxZoom: 19 },
  TOPO:      { label: 'TOPO',  url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',                attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>', maxZoom: 17 },
};

const GOLD_DATA: Record<string, { points: number[]; startLabel: string; endLabel: string }> = {
  '7D':  { points: [3079, 3088, 3082, 3095, 3101, 3108, 3118], startLabel: 'Mar 7', endLabel: 'Mar 13, 2026' },
  '30D': { points: [2885, 2894, 2901, 2918, 2923, 2910, 2932, 2944, 2938, 2957, 2965, 2971, 2961, 2988, 2995, 3002, 2990, 3008, 3018, 3025, 3041, 3038, 3055, 3062, 3048, 3071, 3079, 3088, 3108, 3118], startLabel: 'Feb 12', endLabel: 'Mar 13, 2026' },
  '90D': { points: [2620, 2648, 2670, 2695, 2712, 2730, 2755, 2778, 2800, 2825, 2855, 2890, 2930, 2970, 3020, 3070, 3118], startLabel: 'Dec 14', endLabel: 'Mar 13, 2026' },
  '1Y':  { points: [2180, 2242, 2295, 2340, 2385, 2430, 2475, 2530, 2600, 2695, 2800, 2920, 3050, 3118], startLabel: 'Mar 2025', endLabel: 'Mar 2026' },
  '5Y':  { points: [1730, 1775, 1820, 1850, 1820, 1780, 1810, 1850, 1880, 1900, 1950, 1990, 2020, 2060, 2110, 2180, 2300, 2500, 2780, 3118], startLabel: '2021', endLabel: '2026' },
};

interface GoldCurrency {
  code: string;
  symbol: string;
  name: string;
  fxRate: number;     // 1 USD = X of this currency (Mar 2026)
  change30d: number;  // 30-day % change in gold priced in this currency
}

const GOLD_CURRENCIES: GoldCurrency[] = [
  { code: 'USD', symbol: '$',   name: 'US Dollar',         fxRate: 1.000,  change30d:  8.08 },
  { code: 'EUR', symbol: '€',   name: 'Euro',              fxRate: 0.920,  change30d:  9.20 },
  { code: 'GBP', symbol: '£',   name: 'British Pound',     fxRate: 0.790,  change30d:  7.85 },
  { code: 'JPY', symbol: '¥',   name: 'Japanese Yen',      fxRate: 150.8,  change30d: 10.42 },
  { code: 'CNY', symbol: 'CN¥', name: 'Chinese Yuan',      fxRate: 7.250,  change30d:  8.35 },
  { code: 'INR', symbol: '₹',   name: 'Indian Rupee',      fxRate: 83.70,  change30d:  9.10 },
  { code: 'AUD', symbol: 'A$',  name: 'Australian Dollar', fxRate: 1.555,  change30d:  8.72 },
  { code: 'CHF', symbol: 'Fr',  name: 'Swiss Franc',       fxRate: 0.887,  change30d:  7.95 },
  { code: 'CAD', symbol: 'C$',  name: 'Canadian Dollar',   fxRate: 1.386,  change30d:  8.55 },
  { code: 'TRY', symbol: '₺',   name: 'Turkish Lira',      fxRate: 32.70,  change30d: 14.20 },
];

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
  minesVisible = true;

  private map: L.Map | null = null;
  private tileLayer: L.TileLayer | null = null;
  private markers: L.CircleMarker[] = [];
  private mineMarkers: L.Marker[] = [];
  private sub: Subscription | null = null;

  severityEntries = Object.entries(SEVERITY_COLORS);

  tileKeys = Object.keys(MAP_TILES);
  selectedTile = 'DARK';
  readonly ranges = ['7D', '30D', '90D', '1Y', '5Y'];
  selectedRange = '30D';
  selectedCurrency = 'USD';

  constructor(private mapEventsService: MapEventsService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initMap();
    this.loadEvents();
    this.renderMines();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.map?.remove();
  }

  toggleMines(): void {
    this.minesVisible = !this.minesVisible;
    this.mineMarkers.forEach(m => {
      if (this.map) {
        this.minesVisible ? m.addTo(this.map) : m.remove();
      }
    });
  }

  switchTile(key: string): void {
    if (!this.map || key === this.selectedTile) return;
    this.selectedTile = key;
    if (this.tileLayer) this.tileLayer.remove();
    const t = MAP_TILES[key];
    this.tileLayer = L.tileLayer(t.url, {
      attribution: t.attribution,
      subdomains: (t.subdomains ?? ['a', 'b', 'c']) as any,
      maxZoom: t.maxZoom,
    }).addTo(this.map);
  }

  selectRange(r: string): void {
    this.selectedRange = r;
  }

  private renderMines(): void {
    const icon = L.divIcon({
      className: '',
      html: `<div class="mine-marker">&#9670;</div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -12],
    });

    GOLD_MINES.forEach(mine => {
      const marker = L.marker([mine.lat, mine.lng], { icon });
      marker.bindPopup(this.buildMinePopupHtml(mine));
      if (this.map) marker.addTo(this.map);
      this.mineMarkers.push(marker);
    });
  }

  private buildMinePopupHtml(mine: GoldMine): string {
    return `
      <div style="background:#1a1a1a;color:#e8e8e8;min-width:200px;font-family:'Courier New',monospace;font-size:12px;">
        <div style="color:#ffd700;font-weight:bold;margin-bottom:4px;font-size:13px;">&#9670; ${mine.name}</div>
        <div style="color:#aaa;margin-bottom:6px;">${mine.country}</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:4px;">
          <span style="background:#ffd70022;color:#ffd700;padding:2px 8px;border-radius:2px;font-size:11px;">MINE</span>
          <span style="background:#333;color:#aaa;padding:2px 8px;border-radius:2px;font-size:11px;">${mine.annualOz}</span>
        </div>
        <div style="color:#666;font-size:11px;margin-top:4px;">${mine.operator}</div>
      </div>`;
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [20, 15],
      zoom: 2,
      zoomControl: true,
    });

    const t = MAP_TILES[this.selectedTile];
    this.tileLayer = L.tileLayer(t.url, {
      attribution: t.attribution,
      subdomains: (t.subdomains ?? ['a', 'b', 'c']) as any,
      maxZoom: t.maxZoom,
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

  // ── Gold Price Chart ──────────────────────────────────────────────────
  get activeCurrency(): GoldCurrency {
    return GOLD_CURRENCIES.find(c => c.code === this.selectedCurrency)!;
  }
  get goldCurrencies(): GoldCurrency[] { return GOLD_CURRENCIES; }
  selectCurrency(code: string): void { this.selectedCurrency = code; }

  get activePoints(): number[] {
    const usdPts = GOLD_DATA[this.selectedRange].points;
    const fx = this.activeCurrency.fxRate;
    return usdPts.map(p => Math.round(p * fx));
  }
  get chartDateRange(): { start: string; end: string } {
    const d = GOLD_DATA[this.selectedRange];
    return { start: d.startLabel, end: d.endLabel };
  }

  get goldCurrent(): number { return this.activePoints[this.activePoints.length - 1]; }
  get goldOpen(): number    { return this.activePoints[0]; }
  get goldChange(): number  { return this.goldCurrent - this.goldOpen; }
  get goldHigh(): number    { return Math.max(...this.activePoints); }
  get goldLow(): number     { return Math.min(...this.activePoints); }
  get goldIsPositive(): boolean { return this.goldChange >= 0; }
  get goldChangePct(): string {
    return ((this.goldChange / this.goldOpen) * 100).toFixed(2);
  }
  get formattedPriceChange(): string {
    const sign = this.goldIsPositive ? '+' : '-';
    const abs  = Math.abs(this.goldChange);
    const sym  = this.activeCurrency.symbol;
    if (abs >= 10000) return `${sign}${sym}${Math.round(abs / 1000)}K`;
    return `${sign}${sym}${Math.round(abs).toLocaleString()}`;
  }

  private goldCoords(): [number, number][] {
    const W = 220, H = 80, PAD = 4;
    const pts = this.activePoints;
    const rawMin = Math.min(...pts);
    const rawMax = Math.max(...pts);
    const buf = (rawMax - rawMin) * 0.15 || rawMin * 0.01;
    const min = rawMin - buf;
    const max = rawMax + buf;
    const range = max - min;
    const n = pts.length;
    return pts.map((p, i) => [
      PAD + (i / (n - 1)) * (W - PAD * 2),
      (H - PAD) - ((p - min) / range) * (H - PAD * 2)
    ]);
  }

  get goldAreaPath(): string {
    const c = this.goldCoords();
    const first = c[0][0].toFixed(1);
    const last  = c[c.length - 1][0].toFixed(1);
    const line  = c.map(([x, y]) => `L${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
    return `M${first},80 ${line} L${last},80 Z`;
  }
  get goldLinePath(): string {
    return this.goldCoords()
      .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
      .join(' ');
  }
  get goldLastDot(): { x: number; y: number } {
    const c = this.goldCoords();
    const [x, y] = c[c.length - 1];
    return { x, y };
  }

  // ── Mini-ticker helpers ───────────────────────────────────────────────
  getCurrencyPrice(c: GoldCurrency): number {
    const data30d = GOLD_DATA['30D'].points;
    return Math.round(data30d[data30d.length - 1] * c.fxRate);
  }
  formatMiniPrice(c: GoldCurrency): string {
    const p = this.getCurrencyPrice(c);
    if (p >= 10000) return c.symbol + Math.round(p / 1000) + 'K';
    return c.symbol + p.toLocaleString();
  }
  isCurrencyPositive(c: GoldCurrency): boolean { return c.change30d >= 0; }
  getMiniLinePath(c: GoldCurrency): string {
    const usdPts = GOLD_DATA['30D'].points;
    const pts = usdPts.map(p => p * c.fxRate);
    const W = 44, H = 16, PAD = 1;
    const min = Math.min(...pts);
    const max = Math.max(...pts);
    const range = max - min || 1;
    const n = pts.length;
    return pts.map((p, i) =>
      `${i === 0 ? 'M' : 'L'}${(PAD + (i / (n - 1)) * (W - PAD * 2)).toFixed(1)},` +
      `${((H - PAD) - ((p - min) / range) * (H - PAD * 2)).toFixed(1)}`
    ).join(' ');
  }
}
