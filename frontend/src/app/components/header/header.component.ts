import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ToolbarModule, TagModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() lastFeedUpdate: string | null = null;
  @Input() llmAvailable: boolean | null = null;

  utcTime = '';
  private clockInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.updateClock();
    this.clockInterval = setInterval(() => this.updateClock(), 1000);
  }

  ngOnDestroy(): void {
    if (this.clockInterval) clearInterval(this.clockInterval);
  }

  private updateClock(): void {
    this.utcTime = new Date().toUTCString().replace(' GMT', ' UTC');
  }

  formatLastUpdate(ts: string | null): string {
    if (!ts) return 'Never';
    const mins = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  }

  get llmDotColor(): string {
    if (this.llmAvailable === null) return '#999999';
    return this.llmAvailable ? '#44bb44' : '#ff2222';
  }
}
