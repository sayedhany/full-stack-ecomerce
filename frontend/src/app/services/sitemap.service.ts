import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority?: number;
  alternates?: { lang: string; href: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class SitemapService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  generateSitemap(urls: SitemapUrl[]): string {
    const baseUrl = this.isBrowser
      ? window.location.origin
      : 'https://egypt-fisher.com';

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

    urls.forEach((url) => {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(baseUrl + url.loc)}</loc>\n`;

      if (url.lastmod) {
        xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
      }

      if (url.changefreq) {
        xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      }

      if (url.priority !== undefined) {
        xml += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
      }

      // Add alternate language links
      if (url.alternates && url.alternates.length > 0) {
        url.alternates.forEach((alternate) => {
          xml += `    <xhtml:link rel="alternate" hreflang="${
            alternate.lang
          }" href="${this.escapeXml(baseUrl + alternate.href)}" />\n`;
        });
      }

      xml += '  </url>\n';
    });

    xml += '</urlset>';
    return xml;
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  getStaticPages(): SitemapUrl[] {
    const today = new Date().toISOString().split('T')[0];

    return [
      // Home pages
      {
        loc: '/en',
        lastmod: today,
        changefreq: 'daily',
        priority: 1.0,
        alternates: [
          { lang: 'en', href: '/en' },
          { lang: 'ar', href: '/ar' },
          { lang: 'x-default', href: '/en' },
        ],
      },
      {
        loc: '/ar',
        lastmod: today,
        changefreq: 'daily',
        priority: 1.0,
        alternates: [
          { lang: 'en', href: '/en' },
          { lang: 'ar', href: '/ar' },
          { lang: 'x-default', href: '/en' },
        ],
      },

      // Products pages
      {
        loc: '/en/products',
        lastmod: today,
        changefreq: 'daily',
        priority: 0.9,
        alternates: [
          { lang: 'en', href: '/en/products' },
          { lang: 'ar', href: '/ar/products' },
        ],
      },
      {
        loc: '/ar/products',
        lastmod: today,
        changefreq: 'daily',
        priority: 0.9,
        alternates: [
          { lang: 'en', href: '/en/products' },
          { lang: 'ar', href: '/ar/products' },
        ],
      },

      // About pages
      {
        loc: '/en/about',
        lastmod: today,
        changefreq: 'monthly',
        priority: 0.7,
        alternates: [
          { lang: 'en', href: '/en/about' },
          { lang: 'ar', href: '/ar/about' },
        ],
      },
      {
        loc: '/ar/about',
        lastmod: today,
        changefreq: 'monthly',
        priority: 0.7,
        alternates: [
          { lang: 'en', href: '/en/about' },
          { lang: 'ar', href: '/ar/about' },
        ],
      },

      // Contact pages
      {
        loc: '/en/contact',
        lastmod: today,
        changefreq: 'monthly',
        priority: 0.8,
        alternates: [
          { lang: 'en', href: '/en/contact' },
          { lang: 'ar', href: '/ar/contact' },
        ],
      },
      {
        loc: '/ar/contact',
        lastmod: today,
        changefreq: 'monthly',
        priority: 0.8,
        alternates: [
          { lang: 'en', href: '/en/contact' },
          { lang: 'ar', href: '/ar/contact' },
        ],
      },
    ];
  }

  generateProductUrls(
    products: Array<{ slug: { en: string; ar: string }; updatedAt?: string }>,
    lastmod?: string
  ): SitemapUrl[] {
    const urls: SitemapUrl[] = [];

    products.forEach((product) => {
      const productLastmod = product.updatedAt
        ? new Date(product.updatedAt).toISOString().split('T')[0]
        : lastmod;

      // English product page
      urls.push({
        loc: `/en/products/${product.slug.en}`,
        lastmod: productLastmod,
        changefreq: 'weekly',
        priority: 0.8,
        alternates: [
          { lang: 'en', href: `/en/products/${product.slug.en}` },
          { lang: 'ar', href: `/ar/products/${product.slug.ar}` },
        ],
      });

      // Arabic product page
      urls.push({
        loc: `/ar/products/${product.slug.ar}`,
        lastmod: productLastmod,
        changefreq: 'weekly',
        priority: 0.8,
        alternates: [
          { lang: 'en', href: `/en/products/${product.slug.en}` },
          { lang: 'ar', href: `/ar/products/${product.slug.ar}` },
        ],
      });
    });

    return urls;
  }

  generateCategoryUrls(categories: Array<{ _id: string }>): SitemapUrl[] {
    const urls: SitemapUrl[] = [];
    const today = new Date().toISOString().split('T')[0];

    categories.forEach((category) => {
      // English category page
      urls.push({
        loc: `/en/products?categoryId=${category._id}`,
        lastmod: today,
        changefreq: 'weekly',
        priority: 0.7,
      });

      // Arabic category page
      urls.push({
        loc: `/ar/products?categoryId=${category._id}`,
        lastmod: today,
        changefreq: 'weekly',
        priority: 0.7,
      });
    });

    return urls;
  }
}
