import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AiBriefService } from '../../services/ai-brief.service';
import { AiBriefResponse } from '../../models';
import { Subscription } from 'rxjs';

const BRIEF_TYPES = ['gold', 'world', 'security'];

@Component({
  selector: 'app-ai-brief-panel',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, ScrollPanelModule, ProgressSpinnerModule],
  templateUrl: './ai-brief-panel.component.html',
  styleUrls: ['./ai-brief-panel.component.css']
})
export class AiBriefPanelComponent implements OnDestroy {
  @Input() headlines: string[] = [];
  @Output() llmStatusChange = new EventEmitter<boolean>();

  briefTypes = BRIEF_TYPES;
  selectedBriefType = 'gold';
  data: AiBriefResponse | null = null;
  loading = false;
  error: string | null = null;

  private sub: Subscription | null = null;

  constructor(private aiBriefService: AiBriefService) {}

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  selectBriefType(type: string): void {
    this.selectedBriefType = type;
  }

  generateBrief(): void {
    if (this.loading || this.headlines.length === 0) return;
    this.sub?.unsubscribe();
    this.loading = true;
    this.error = null;
    this.sub = this.aiBriefService.generateBrief(this.selectedBriefType, this.headlines).subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;
        this.llmStatusChange.emit(!res.error);
      },
      error: (err) => {
        this.error = err.message || 'Failed to generate brief';
        this.loading = false;
      }
    });
  }

  get formattedGeneratedAt(): string {
    if (!this.data?.generatedAt) return '';
    return new Date(this.data.generatedAt).toUTCString();
  }
}
