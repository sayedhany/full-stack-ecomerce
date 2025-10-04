import {
  Injectable,
  PLATFORM_ID,
  inject,
  Inject,
  Optional,
  LOCALE_ID,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export type SupportedLanguage = 'en' | 'ar';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private translateService = inject(TranslateService);
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private localeId = inject(LOCALE_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private readonly SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'ar'];
  private readonly DEFAULT_LANGUAGE: SupportedLanguage = 'en';

  private currentLang: SupportedLanguage = 'en';

  constructor(
    @Optional() @Inject('TRANSLATIONS') private serverTranslations: any,
    @Optional() @Inject('CURRENT_LANGUAGE') private serverLanguage: string
  ) {
    // Initialize translation service
    this.initializeTranslation();

    // Initialize routing-based language detection
    this.initializeRouting();
  }

  private initializeTranslation(): void {
    // Set available languages
    this.translateService.addLangs(['en', 'ar']);
    this.translateService.setDefaultLang('en');

    // Get language from multiple sources
    const urlLanguage = this.getCurrentLanguageFromUrl();
    const localeLanguage = this.getLanguageFromLocale();
    const serverProvidedLanguage = this.serverLanguage as SupportedLanguage;

    // Priority: URL > Server > Locale (SSR) > Default
    const initialLanguage =
      urlLanguage ||
      serverProvidedLanguage ||
      localeLanguage ||
      this.DEFAULT_LANGUAGE;

    console.log('Language detection:', {
      url: urlLanguage,
      server: serverProvidedLanguage,
      locale: localeLanguage,
      final: initialLanguage,
    });

    this.currentLang = initialLanguage;

    // If we have server translations, use them immediately (SSR)
    if (this.serverTranslations && serverProvidedLanguage) {
      this.translateService.setTranslation(
        serverProvidedLanguage,
        this.serverTranslations
      );
      console.log(
        `SSR: Using server-provided translations for ${serverProvidedLanguage}`
      );

      // Also immediately use that language
      this.translateService.use(serverProvidedLanguage).subscribe({
        next: () => {
          console.log(`Initial language loaded: ${serverProvidedLanguage}`);
          this.updateDOM(serverProvidedLanguage);
        },
        error: (error) => {
          console.error('Error using server translations:', error);
        },
      });
    } else {
      // Load translations via HTTP (client-side or no SSR)
      this.translateService.use(initialLanguage).subscribe({
        next: () => {
          console.log(`Initial language loaded: ${initialLanguage}`);
          this.updateDOM(initialLanguage);
        },
        error: (error) => {
          console.error('Error loading initial language:', error);
          this.translateService.use('en');
          this.currentLang = 'en';
          this.updateDOM('en');
        },
      });
    }
  }

  private initializeRouting(): void {
    // Listen to route changes to detect language
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const language = this.getCurrentLanguageFromUrl();
        if (
          language &&
          this.isValidLanguage(language) &&
          this.currentLang !== language
        ) {
          this.currentLang = language;
          this.translateService.use(language).subscribe({
            next: () => {
              console.log(`Language switched to: ${language}`);
              this.updateDOM(language);
            },
            error: (error) => {
              console.error('Error loading translations:', error);
            },
          });
        }
      });
  }

  getCurrentLanguage(): SupportedLanguage {
    return this.currentLang;
  }

  setLanguage(languageCode: SupportedLanguage): void {
    if (!this.isValidLanguage(languageCode)) {
      console.warn(`Language ${languageCode} is not supported`);
      return;
    }
    this.switchLanguage(languageCode);
  }

  switchLanguage(newLanguage: SupportedLanguage): void {
    if (!this.isValidLanguage(newLanguage)) {
      console.warn(`Language ${newLanguage} is not supported`);
      return;
    }

    console.log(
      `Switching language from ${this.currentLang} to ${newLanguage}`
    );

    const currentUrl = this.router.url;
    const currentLang = this.getCurrentLanguageFromUrl();

    let newUrl: string;
    if (currentLang) {
      newUrl = currentUrl.replace(`/${currentLang}`, `/${newLanguage}`);
    } else {
      newUrl = `/${newLanguage}${currentUrl}`;
    }

    // Use window.location.href for full page reload (SSR request)
    if (this.isBrowser) {
      window.location.href = newUrl;
    } else {
      // On server, just navigate normally
      this.router.navigateByUrl(newUrl);
    }
  }

  private getCurrentLanguageFromUrl(): SupportedLanguage | null {
    let url: string;

    if (this.isBrowser) {
      url = this.router.url;
    } else {
      url = this.document.location?.pathname || '/en';
    }

    const urlSegments = url.split('/').filter((s) => s);
    const langSegment = urlSegments[0];

    if (this.isValidLanguage(langSegment)) {
      return langSegment as SupportedLanguage;
    }

    return null;
  }

  private getLanguageFromLocale(): SupportedLanguage | null {
    const lang = this.localeId.split('-')[0] as SupportedLanguage;
    return this.isValidLanguage(lang) ? lang : null;
  }

  private isValidLanguage(language: string): language is SupportedLanguage {
    return this.SUPPORTED_LANGUAGES.includes(language as SupportedLanguage);
  }

  private updateDOM(language: SupportedLanguage): void {
    const isRtl = language === 'ar';
    const htmlElement = this.document.documentElement;

    htmlElement.setAttribute('lang', language);
    htmlElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');

    if (this.isBrowser) {
      htmlElement.classList.toggle('rtl', isRtl);
      htmlElement.classList.toggle('ltr', !isRtl);

      this.document.body.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
      this.document.body.classList.toggle('rtl', isRtl);
      this.document.body.classList.toggle('ltr', !isRtl);

      console.log(
        `DOM updated - Language: ${language}, Dir: ${isRtl ? 'rtl' : 'ltr'}`
      );
    }
  }
}
