import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from './services/translation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'frontend';
  translationService = inject(LanguageService);

  get currentLang(): string {
    return this.translationService.getCurrentLanguage();
  }

  switchLanguage(lang: 'en' | 'ar') {
    this.translationService.setLanguage(lang);
  }
}
