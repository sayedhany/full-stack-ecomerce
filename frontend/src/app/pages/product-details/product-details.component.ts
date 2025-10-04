import { Component, OnInit, inject, signal, PLATFORM_ID, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ProductService } from '../../services/product.service';
import { SeoService } from '../../services/seo.service';
import {
  LanguageService,
  SupportedLanguage,
} from '../../services/translation.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-details',
  standalone: true,
  
    changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslateModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private languageService = inject(LanguageService);
  private seoService = inject(SeoService);
  private platformId = inject(PLATFORM_ID);

  private isBrowser = isPlatformBrowser(this.platformId);

  product = signal<Product | null>(null);
  loading = signal<boolean>(true);

  get currentLang(): SupportedLanguage {
    return this.languageService.getCurrentLanguage();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const slug = params['slug'];
      if (slug) {
        this.loadProduct(slug);
      }
    });
  }

  loadProduct(slug: string): void {
    this.loading.set(true);
    this.productService.getProductBySlug(slug).subscribe({
      next: (product) => {
        this.product.set(product.data);
        this.updateSEO(product.data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading.set(false);
      },
    });
  }

  private updateSEO(product: Product): void {
    const currentUrl = this.isBrowser ? window.location.href : '';
    const lang = this.currentLang;
    const name = this.getLocalizedName(product);
    const description = this.getLocalizedDescription(product);

    this.seoService.updateMetaTags({
      title: `${name} | EgyptFisher`,
      description: description,
      keywords: `${name}, ${this.getLocalizedName(
        product.category
      )}, online shopping, EgyptFisher`,
      image: product.image,
      url: currentUrl,
      type: 'product',
      lang: lang,
    });

    this.seoService.updateCanonicalUrl(currentUrl);

    // Add product structured data
    this.seoService.generateStructuredData('product', {
      name: name,
      description: description,
      image: product.image,
      price: product.price,
    });

    // Add breadcrumb structured data
    this.seoService.generateStructuredData('breadcrumb', {
      items: [
        { name: 'Home', url: `/${this.currentLang}` },
        {
          name: this.getLocalizedName(product.category),
          url: `/${this.currentLang}`,
        },
        { name: name, url: currentUrl },
      ],
    });
  }

  getLocalizedName(item: { name: { en: string; ar: string } }): string {
    return item.name[this.currentLang];
  }

  getLocalizedDescription(product: Product): string {
    return product.description[this.currentLang];
  }

  goBack(): void {
    this.router.navigate(['/', this.currentLang]);
  }
}
