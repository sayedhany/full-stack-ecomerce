import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  PLATFORM_ID,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { SeoService } from '../../services/seo.service';
import {
  LanguageService,
  SupportedLanguage,
} from '../../services/translation.service';
import { Product, Category } from '../../models/product.model';
import { ProductFiltersComponent } from '../../components/product-filters/product-filters.component';
import { ProductsGridComponent } from '../../components/products-grid/products-grid.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ProductFiltersComponent,
    ProductsGridComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent implements OnInit {
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

  // Pagination
  currentPage = signal<number>(1);
  totalPages = signal<number>(1);
  totalProducts = signal<number>(0);
  itemsPerPage = 12;

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
    const localizedSeo = this.seoService.getLocalizedSeoData(lang, 'products');

    this.seoService.updateMetaTags({
      ...localizedSeo,
      url: currentUrl,
      type: 'website',
      lang: lang,
    });

    this.seoService.updateCanonicalUrl(currentUrl);
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

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    // Reset to first page when searching
    if (this.currentPage() !== 1) {
      this.loadProducts(1);
    }
  }

  onCategoryChange(value: string): void {
    this.selectedCategory.set(value);
    // Reset to first page when filtering
    if (this.currentPage() !== 1) {
      this.loadProducts(1);
    }
  }
}
