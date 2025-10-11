import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LanguageService } from './services/translation.service';
import { LoadingComponent } from './components/loading/loading.component';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule, CommonModule, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'frontend';
  translationService = inject(LanguageService);
  private seoService = inject(SeoService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  ngOnInit(): void {
    // Add organization structured data for better SEO
    if (this.isBrowser) {
      const baseUrl = window.location.origin;
      this.seoService.generateStructuredData('organization', {
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
      });
    }
  }

  get currentLang(): string {
    return this.translationService.getCurrentLanguage();
  }

  switchLanguage(lang: 'en' | 'ar') {
    this.translationService.setLanguage(lang);
  }
}
