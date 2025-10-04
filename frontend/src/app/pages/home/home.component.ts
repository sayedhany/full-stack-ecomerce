import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { SeoService } from '../../services/seo.service';
import {
  LanguageService,
  SupportedLanguage,
} from '../../services/translation.service';
import { Product, Category } from '../../models/product.model';
import { register } from 'swiper/element/bundle';

// Register Swiper custom elements
register();

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private languageService = inject(LanguageService);
  private seoService = inject(SeoService);
  private platformId = inject(PLATFORM_ID);

  isBrowser = isPlatformBrowser(this.platformId);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal<boolean>(true);

  searchTerm = signal<string>('');
  selectedCategory = signal<string>('');

  filteredProducts = computed(() => {
    let filtered = this.products();

    // Filter by search term
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.en.toLowerCase().includes(term) ||
          product.name.ar.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (this.selectedCategory()) {
      filtered = filtered.filter(
        (product) => product.category._id === this.selectedCategory()
      );
    }

    return filtered;
  });

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
    this.loadCategories();
    this.loadProducts();
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

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        this.categories.set(response.data);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });
  }

  loadProducts(): void {
    this.loading.set(true);
    this.productService.getProducts().subscribe({
      next: (response) => {
        this.products.set(response.data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading.set(false);
      },
    });
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  onCategoryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCategory.set(value);
  }

  getLocalizedName(item: { name: { en: string; ar: string } }): string {
    return item.name[this.currentLang];
  }

  getLocalizedDescription(product: Product): string {
    return product.description[this.currentLang];
  }

  getProductSlug(product: Product): string {
    return this.currentLang + '/' + product.slug[this.currentLang];
  }
}
