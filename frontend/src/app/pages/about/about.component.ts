import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SeoService } from '../../services/seo.service';
import {
  LanguageService,
  SupportedLanguage,
} from '../../services/translation.service';
import { CONTACT_INFO } from '../../config/contact.config';

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
  contactInfo = CONTACT_INFO;

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
      lang === 'ar'
        ? `من نحن - ${CONTACT_INFO.companyName}`
        : `About Us - ${CONTACT_INFO.companyName}`;
    const description =
      lang === 'ar'
        ? `تعرف على ${CONTACT_INFO.companyName} - شريكك الموثوق للمنتجات عالية الجودة`
        : `Learn about ${CONTACT_INFO.companyName} - Your trusted partner for quality products`;

    this.seoService.updateMetaTags({
      title,
      description,
      keywords: `about us, company, ${CONTACT_INFO.companyName}, quality products`,
      url: currentUrl,
      type: 'website',
      lang: lang,
    });

    this.seoService.updateCanonicalUrl(currentUrl);
  }
}
