import { Component, input, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Inputs
  product = input.required<Product>();
  currentLang = input<string>('en');

  getLocalizedName(item: any): string {
    const lang = this.currentLang();
    return item.name?.[lang as 'en' | 'ar'] || item.name?.en || '';
  }

  getLocalizedDescription(product: Product): string {
    const lang = this.currentLang();
    return (
      product.description?.[lang as 'en' | 'ar'] ||
      product.description?.en ||
      ''
    );
  }

  getProductSlug(product: Product): string {
    const lang = this.currentLang();
    return (
      product.slug?.[lang as 'en' | 'ar'] || product.slug?.en || product._id
    );
  }

  orderOnWhatsApp(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const product = this.product();
    const productName = this.getLocalizedName(product);
    const productPrice = product.price;

    // Create product URL
    const baseUrl = this.isBrowser ? window.location.origin : '';
    const lang = this.currentLang();
    const slug = this.getProductSlug(product);
    const productUrl = `${baseUrl}/${lang}/product/${slug}`;

    // Create WhatsApp message
    const message =
      lang === 'ar'
        ? `مرحباً، أنا مهتم بهذا المنتج:\n\n*${productName}*\nالسعر: $${productPrice}\n\nالرابط: ${productUrl}`
        : `Hello, I'm interested in this product:\n\n*${productName}*\nPrice: $${productPrice}\n\nLink: ${productUrl}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = '201277782993'; // Egypt country code + number
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Open WhatsApp in new tab
    if (this.isBrowser) {
      window.open(whatsappUrl, '_blank');
    }
  }
}
