import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  LanguageService,
  SupportedLanguage,
} from '../../services/translation.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  languageService = inject(LanguageService);
  themeService = inject(ThemeService);

  get currentLang(): SupportedLanguage {
    return this.languageService.getCurrentLanguage();
  }

  switchLanguage(lang: SupportedLanguage): void {
    this.languageService.setLanguage(lang);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
