import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { NewsPanelComponent } from './components/news-panel/news-panel.component';
import { MapPanelComponent } from './components/map-panel/map-panel.component';
import { AiBriefPanelComponent } from './components/ai-brief-panel/ai-brief-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    NewsPanelComponent,
    MapPanelComponent,
    AiBriefPanelComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  headlines: string[] = [];
  lastFeedUpdate: string | null = null;
  llmAvailable: boolean | null = null;

  onHeadlinesLoaded(items: string[]): void {
    this.headlines = items;
    this.lastFeedUpdate = new Date().toISOString();
  }

  onLlmStatus(available: boolean): void {
    this.llmAvailable = available;
  }
}
