import {
  Component,
  OnInit,
  inject,
  signal,
  CUSTOM_ELEMENTS_SCHEMA,
  PLATFORM_ID,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from '../../services/product.service';
import { SeoService } from '../../services/seo.service';
import {
  LanguageService,
  SupportedLanguage,
} from '../../services/translation.service';
import { Product } from '../../models/product.model';
import { register } from 'swiper/element/bundle';
import { ProductCardComponent } from '../../components/product-card/product-card.component';

// Register Swiper custom elements
register();

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private languageService = inject(LanguageService);
  private seoService = inject(SeoService);
  private platformId = inject(PLATFORM_ID);

  isBrowser = isPlatformBrowser(this.platformId);

  featuredProducts = signal<Product[]>([]);
  loading = signal<boolean>(true);

  carouselImages = [
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200',
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200',
  ];

  get currentLang(): SupportedLanguage {
    return this.languageService.getCurrentLanguage();
  }

  ngOnInit(): void {
    this.updateSEO();
    this.loadFeaturedProducts();
  }

  private updateSEO(): void {
    const currentUrl = this.isBrowser ? window.location.href : '';
    const lang = this.currentLang;

    // Get localized SEO data
    const localizedSeo = this.seoService.getLocalizedSeoData(lang, 'home');

    this.seoService.updateMetaTags({
      ...localizedSeo,
      image: this.carouselImages[0],
      url: currentUrl,
      type: 'website',
      lang: lang,
    });

    this.seoService.updateCanonicalUrl(currentUrl);

    // Add organization structured data
    this.seoService.generateStructuredData('organization', {
      url: currentUrl,
      logo: this.carouselImages[0],
    });
  }

  loadFeaturedProducts(): void {
    this.loading.set(true);
    // Load first 8 products as featured
    this.productService.getProducts(1, 8).subscribe({
      next: (response) => {
        this.featuredProducts.set(response.data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading featured products:', error);
        this.loading.set(false);
      },
    });
  }
}
