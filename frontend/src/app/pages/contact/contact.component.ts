import {
  Component,
  OnInit,
  inject,
  PLATFORM_ID,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SeoService } from '../../services/seo.service';
import {
  LanguageService,
  SupportedLanguage,
} from '../../services/translation.service';

@Component({
  selector: 'app-contact',
  standalone: true,

  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  private seoService = inject(SeoService);
  private languageService = inject(LanguageService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  contactInfo = {
    email: 'info@egyptfisher.com',
    phone: '+20 123 456 7890',
    location: 'Cairo, Egypt',
  };

  get currentLang(): SupportedLanguage {
    return this.languageService.getCurrentLanguage();
  }

  ngOnInit(): void {
    this.updateSEO();
  }

  private updateSEO(): void {
    const currentUrl = this.isBrowser ? window.location.href : '';
    const lang = this.currentLang;

    // Get localized SEO data
    const localizedSeo = this.seoService.getLocalizedSeoData(lang, 'contact');

    this.seoService.updateMetaTags({
      ...localizedSeo,
      url: currentUrl,
      type: 'website',
      lang: lang,
    });

    this.seoService.updateCanonicalUrl(currentUrl);
  }
}
