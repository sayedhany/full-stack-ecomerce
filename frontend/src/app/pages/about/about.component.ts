import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SeoService } from '../../services/seo.service';
import {
  LanguageService,
  SupportedLanguage,
} from '../../services/translation.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements OnInit {
  private languageService = inject(LanguageService);
  private seoService = inject(SeoService);
  private platformId = inject(PLATFORM_ID);

  private isBrowser = isPlatformBrowser(this.platformId);

  get currentLang(): SupportedLanguage {
    return this.languageService.getCurrentLanguage();
  }

  ngOnInit(): void {
    this.updateSEO();
  }

  private updateSEO(): void {
    const currentUrl = this.isBrowser ? window.location.href : '';
    const lang = this.currentLang;

    const title =
      lang === 'ar' ? 'من نحن - EgyptFisher' : 'About Us - EgyptFisher';
    const description =
      lang === 'ar'
        ? 'تعرف على EgyptFisher - شريكك الموثوق للمنتجات عالية الجودة'
        : 'Learn about EgyptFisher - Your trusted partner for quality products';

    this.seoService.updateMetaTags({
      title,
      description,
      keywords: 'about us, company, EgyptFisher, quality products',
      url: currentUrl,
      type: 'website',
      lang: lang,
    });

    this.seoService.updateCanonicalUrl(currentUrl);
  }
}
