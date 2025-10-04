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
      : 'https://www.egyptfisher.com';

    const urlEntries = urls
      .map(
        (url) => `
  <url>
    <loc>${baseUrl}${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
  </url>`
      )
      .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
  }

  getStaticPages(): SitemapUrl[] {
    const today = new Date().toISOString().split('T')[0];

    return [
      // English pages
      { loc: '/en', lastmod: today, changefreq: 'daily', priority: 1.0 },
      {
        loc: '/en/contact',
        lastmod: today,
        changefreq: 'monthly',
        priority: 0.8,
      },

      // Arabic pages
      { loc: '/ar', lastmod: today, changefreq: 'daily', priority: 1.0 },
      {
        loc: '/ar/contact',
        lastmod: today,
        changefreq: 'monthly',
        priority: 0.8,
      },
    ];
  }

  generateProductUrls(
    productSlugs: { en: string; ar: string }[],
    lastmod?: string
  ): SitemapUrl[] {
    const urls: SitemapUrl[] = [];

    productSlugs.forEach((slug) => {
      urls.push(
        {
          loc: `/en/product/${slug.en}`,
          lastmod,
          changefreq: 'weekly',
          priority: 0.9,
        },
        {
          loc: `/ar/product/${slug.ar}`,
          lastmod,
          changefreq: 'weekly',
          priority: 0.9,
        }
      );
    });

    return urls;
  }
}
