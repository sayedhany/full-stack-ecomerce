import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  PLATFORM_ID,
  ChangeDetectionStrategy,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private languageService = inject(LanguageService);
  private seoService = inject(SeoService);
  private platformId = inject(PLATFORM_ID);

  isBrowser = isPlatformBrowser(this.platformId);
  Math = Math; // Expose Math to template

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal<boolean>(true);

  searchTerm = signal<string>('');
  selectedCategory = signal<string>('');

  // Pagination
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  totalProducts = signal<number>(0);
  itemsPerPage = 10;

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

  loadProducts(page: number = 1): void {
    this.loading.set(true);
    this.currentPage.set(page);

    this.productService.getProducts(page, this.itemsPerPage).subscribe({
      next: (response) => {
        this.products.set(response.data);
        this.totalPages.set(response.pages);
        this.totalProducts.set(response.total);
        this.loading.set(false);

        // Scroll to top when page changes
        if (this.isBrowser && page > 1) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading.set(false);
      },
    });
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.loadProducts(page);
    }
  }

  getPaginationArray(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const delta = 2; // Number of pages to show on each side
    const range: number[] = [];

    for (
      let i = Math.max(2, current - delta);
      i <= Math.min(total - 1, current + delta);
      i++
    ) {
      range.push(i);
    }

    if (current - delta > 2) {
      range.unshift(-1); // -1 represents ellipsis
    }
    if (current + delta < total - 1) {
      range.push(-1); // -1 represents ellipsis
    }

    range.unshift(1);
    if (total > 1) {
      range.push(total);
    }

    return range;
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    // Reset to first page when searching
    if (this.currentPage() !== 1) {
      this.loadProducts(1);
    }
  }

  onCategoryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCategory.set(value);
    // Reset to first page when filtering
    if (this.currentPage() !== 1) {
      this.loadProducts(1);
    }
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
