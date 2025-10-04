import { Injectable, inject, PLATFORM_ID, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

export interface SeoData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  lang?: 'en' | 'ar';
}

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor(
    private meta: Meta,
    private titleService: Title,
    @Inject(DOCUMENT) private document: Document
  ) {}

  updateTitle(title: string): void {
    this.titleService.setTitle(title);
  }

  updateMetaTags(seoData: SeoData): void {
    const {
      title = 'EgyptFisher - Your Trusted E-Commerce Partner',
      description = 'Discover quality products at EgyptFisher. Browse our wide selection of electronics and more.',
      keywords = 'e-commerce, online shopping, electronics, EgyptFisher',
      image = 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
      url = '',
      type = 'website',
      lang = 'en',
    } = seoData;

    // Update title
    this.titleService.setTitle(title);

    // Update HTML lang attribute
    if (this.document.documentElement) {
      this.document.documentElement.setAttribute('lang', lang);
    }

    // Standard meta tags
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: keywords });
    this.meta.updateTag({ name: 'author', content: 'EgyptFisher' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });

    // Open Graph meta tags
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: type });
    this.meta.updateTag({ property: 'og:site_name', content: 'EgyptFisher' });
    this.meta.updateTag({
      property: 'og:locale',
      content: lang === 'ar' ? 'ar_EG' : 'en_US',
    });

    // Twitter Card meta tags
    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    // Additional SEO tags
    this.meta.updateTag({
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    });
    this.meta.updateTag({ name: 'theme-color', content: '#2563eb' });
  }

  updateCanonicalUrl(url: string): void {
    if (!this.isBrowser) {
      return; // Don't manipulate DOM on server
    }

    let link: HTMLLinkElement | null = this.document.querySelector(
      'link[rel="canonical"]'
    );

    if (link) {
      link.setAttribute('href', url);
    } else {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      this.document.head.appendChild(link);
    }
  }

  generateStructuredData(
    type: 'product' | 'organization' | 'breadcrumb',
    data: any
  ): void {
    let structuredData: any;

    switch (type) {
      case 'product':
        structuredData = {
          '@context': 'https://schema.org/',
          '@type': 'Product',
          name: data.name,
          description: data.description,
          image: data.image,
          offers: {
            '@type': 'Offer',
            price: data.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
        };
        break;

      case 'organization':
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'EgyptFisher',
          url: data.url,
          logo: data.logo,
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+20-123-456-7890',
            contactType: 'Customer Service',
            email: 'info@egyptfisher.com',
          },
        };
        break;

      case 'breadcrumb':
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data.items.map((item: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
        };
        break;
    }

    if (structuredData) {
      this.addStructuredDataToHead(structuredData);
    }
  }

  private addStructuredDataToHead(data: any): void {
    if (!this.isBrowser) {
      return; // Don't manipulate DOM on server
    }

    let script: HTMLScriptElement | null = this.document.querySelector(
      'script[type="application/ld+json"]'
    );

    if (!script) {
      script = this.document.createElement('script');
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(data);
  }

  // Language-specific SEO helpers
  getLocalizedSeoData(lang: 'en' | 'ar', pageName: string): Partial<SeoData> {
    const seoContent = {
      en: {
        home: {
          title: 'EgyptFisher - Quality Products Online',
          description:
            'Discover our wide selection of electronics and quality products. Shop online with EgyptFisher for the best deals.',
          keywords:
            'e-commerce, online shopping, electronics, laptops, products, EgyptFisher',
        },
        contact: {
          title: 'Contact Us | EgyptFisher',
          description:
            'Get in touch with EgyptFisher. Contact us via email, phone, or visit our location in Cairo, Egypt.',
          keywords: 'contact, customer service, support, EgyptFisher, Cairo',
        },
      },
      ar: {
        home: {
          title: 'EgyptFisher - منتجات عالية الجودة عبر الإنترنت',
          description:
            'اكتشف مجموعتنا الواسعة من الإلكترونيات والمنتجات عالية الجودة. تسوق عبر الإنترنت مع EgyptFisher للحصول على أفضل العروض.',
          keywords:
            'التجارة الإلكترونية، التسوق عبر الإنترنت، الإلكترونيات، أجهزة الكمبيوتر المحمولة، المنتجات، EgyptFisher',
        },
        contact: {
          title: 'اتصل بنا | EgyptFisher',
          description:
            'تواصل مع EgyptFisher. اتصل بنا عبر البريد الإلكتروني أو الهاتف أو قم بزيارة موقعنا في القاهرة، مصر.',
          keywords: 'اتصال، خدمة العملاء، دعم، EgyptFisher، القاهرة',
        },
      },
    };

    return {
      ...seoContent[lang][pageName as keyof typeof seoContent.en],
      lang,
    };
  }
}
