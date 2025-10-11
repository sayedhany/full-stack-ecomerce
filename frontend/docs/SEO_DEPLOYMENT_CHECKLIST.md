# SEO Deployment Checklist

## 🚀 Pre-Deployment Configuration

### 1. Update Domain URLs

Replace `www.egyptfisher.com` with your actual domain in:

- [ ] `frontend/public/sitemap.xml` (all `<loc>` tags)
- [ ] `frontend/public/robots.txt` (Sitemap line)
- [ ] `frontend/src/app/services/sitemap.service.ts` (baseUrl variable)
- [ ] Any hardcoded URLs in SEO service

**Command to find all instances**:

```bash
cd frontend
grep -r "www.egyptfisher.com" src/ public/
```

### 2. Verify Contact Information

Update in `frontend/src/app/services/seo.service.ts`:

- [ ] Phone number: `+201277782993` (line ~140)
- [ ] Email addresses: `info@egyptfisher.com`, `sales@egyptfisher.com`
- [ ] Physical address: Update street address in organization schema
- [ ] Social media URLs: Facebook, Twitter, Instagram, LinkedIn

### 3. Add Logo File

- [ ] Create/upload `logo.png` to `frontend/public/` folder
- [ ] Recommended size: 800x600px or similar
- [ ] Verify logo URL in organization schema references it correctly

### 4. Verify Image URLs

- [ ] Update default OG image in `index.html` (currently Unsplash placeholder)
- [ ] Ensure product images are high quality (1200x630 for OG)

## 📤 Post-Deployment Tasks

### Search Engine Submission

#### Google Search Console

1. [ ] Go to https://search.google.com/search-console
2. [ ] Add property (your domain)
3. [ ] Verify ownership (HTML file, DNS, or meta tag method)
4. [ ] Submit sitemap: `https://yourdomain.com/sitemap.xml`
5. [ ] Request indexing for main pages
6. [ ] Set up email alerts for issues

#### Bing Webmaster Tools

1. [ ] Go to https://www.bing.com/webmasters
2. [ ] Add your site
3. [ ] Verify ownership
4. [ ] Submit sitemap: `https://yourdomain.com/sitemap.xml`
5. [ ] Set up alerts

### Analytics Setup

- [ ] Set up Google Analytics 4
- [ ] Add GA4 tracking code to app
- [ ] Configure conversion tracking
- [ ] Set up custom events (product views, cart actions)

## 🧪 Testing & Validation

### SEO Testing Tools

#### Google Rich Results Test

1. [ ] Visit: https://search.google.com/test/rich-results
2. [ ] Test homepage URL
3. [ ] Test product detail page URL
4. [ ] Verify Organization schema displays correctly
5. [ ] Verify Product schema displays correctly
6. [ ] Fix any errors or warnings

#### Mobile-Friendly Test

1. [ ] Visit: https://search.google.com/test/mobile-friendly
2. [ ] Test all main pages
3. [ ] Fix any mobile usability issues

#### PageSpeed Insights

1. [ ] Visit: https://pagespeed.web.dev/
2. [ ] Test homepage (both EN and AR)
3. [ ] Test products page
4. [ ] Test product detail page
5. [ ] Aim for score > 90 on mobile and desktop
6. [ ] Address performance recommendations

#### Social Media Preview Testing

**Twitter Card Validator**:

1. [ ] Visit: https://cards-dev.twitter.com/validator
2. [ ] Test URL
3. [ ] Verify card displays correctly with image and description

**Facebook Sharing Debugger**:

1. [ ] Visit: https://developers.facebook.com/tools/debug/
2. [ ] Test URL
3. [ ] Scrape again if needed to update cache
4. [ ] Verify OG tags display correctly

**LinkedIn Post Inspector**:

1. [ ] Visit: https://www.linkedin.com/post-inspector/
2. [ ] Test URL
3. [ ] Verify preview looks good

### Technical SEO Checks

#### Sitemap Validation

```bash
# Check sitemap is accessible
curl https://yourdomain.com/sitemap.xml

# Validate XML format (if xmllint is installed)
curl https://yourdomain.com/sitemap.xml | xmllint --noout -
```

- [ ] Sitemap returns 200 status
- [ ] XML is valid
- [ ] All URLs are accessible
- [ ] No broken links

#### Robots.txt Validation

```bash
# Check robots.txt is accessible
curl https://yourdomain.com/robots.txt
```

- [ ] Returns 200 status
- [ ] Sitemap URL is correct
- [ ] Disallow rules are correct

#### Canonical URLs

- [ ] Check canonical tags exist on all pages
- [ ] Verify they point to correct URLs
- [ ] No mixed HTTP/HTTPS issues

#### Hreflang Tags

- [ ] English pages have `hreflang="en"` links
- [ ] Arabic pages have `hreflang="ar"` links
- [ ] `x-default` points to default language (English)
- [ ] URLs in hreflang are absolute (not relative)

#### SSL Certificate

- [ ] HTTPS is enabled
- [ ] Certificate is valid
- [ ] No mixed content warnings
- [ ] HTTP redirects to HTTPS

## 📊 Monitoring Setup

### Google Search Console

Monitor these metrics:

- [ ] Coverage (indexed pages)
- [ ] Performance (clicks, impressions, CTR)
- [ ] Core Web Vitals
- [ ] Mobile usability
- [ ] Structured data
- [ ] Manual actions
- [ ] Security issues

### Bing Webmaster Tools

Monitor:

- [ ] Site scan results
- [ ] SEO analyzer reports
- [ ] Crawl errors
- [ ] Backlinks

### Regular Checks (Weekly)

- [ ] Check for crawl errors
- [ ] Review new backlinks
- [ ] Monitor keyword rankings
- [ ] Check page speed metrics
- [ ] Review Core Web Vitals

### Regular Checks (Monthly)

- [ ] Update sitemap if new products added
- [ ] Review and update meta descriptions
- [ ] Check for broken links
- [ ] Update content for freshness
- [ ] Review organic traffic trends
- [ ] Analyze top-performing pages

## 🎯 Optimization Tasks

### Content Optimization

- [ ] Add alt text to all images
- [ ] Ensure headings follow hierarchy (h1 → h2 → h3)
- [ ] Add internal links between related pages
- [ ] Write unique product descriptions (not duplicate)
- [ ] Add FAQ section with structured data
- [ ] Create blog for content marketing

### Technical Optimization

- [ ] Implement image lazy loading (already done with SSR)
- [ ] Optimize images (WebP format)
- [ ] Minify CSS and JavaScript (production build)
- [ ] Enable gzip/brotli compression
- [ ] Implement service worker for offline support
- [ ] Add 404 error page
- [ ] Implement proper 301 redirects

### Performance Optimization

- [ ] Monitor and improve Core Web Vitals:
  - LCP (Largest Contentful Paint) < 2.5s
  - FID (First Input Delay) < 100ms
  - CLS (Cumulative Layout Shift) < 0.1
- [ ] Reduce JavaScript bundle size
- [ ] Implement code splitting
- [ ] Use CDN for static assets
- [ ] Optimize font loading

## 🌍 Local SEO (Egypt)

### Google My Business

- [ ] Create Google My Business listing
- [ ] Add complete business information
- [ ] Upload photos
- [ ] Add business hours
- [ ] Enable messaging
- [ ] Request reviews from customers

### Local Directories

- [ ] List on Egyptian business directories
- [ ] List on Arab business directories
- [ ] Ensure NAP (Name, Address, Phone) consistency

### Local Keywords

- [ ] Target "Egypt" and "Cairo" in keywords
- [ ] Create Egypt-specific content
- [ ] Add Arabic keyword variations

## 📱 Additional Enhancements

### PWA Features

- [ ] Add service worker
- [ ] Create web app manifest
- [ ] Enable offline mode
- [ ] Add install prompt

### Schema Markup Expansion

- [ ] Add Review schema (when reviews are implemented)
- [ ] Add FAQ schema on relevant pages
- [ ] Add How-To schema for guides
- [ ] Add Video schema (if adding product videos)
- [ ] Add LocalBusiness schema

### Social Media Integration

- [ ] Create social media profiles
- [ ] Add social sharing buttons
- [ ] Implement Open Graph for dynamic content
- [ ] Create sharable product images

## 🔍 Advanced SEO

### Link Building

- [ ] Create valuable content for backlinks
- [ ] Guest post on relevant blogs
- [ ] Reach out to industry influencers
- [ ] Submit to relevant directories
- [ ] Partner with complementary businesses

### Content Marketing

- [ ] Start a blog
- [ ] Create buying guides
- [ ] Publish product comparisons
- [ ] Share industry news
- [ ] Create how-to videos

### User Experience

- [ ] Implement breadcrumbs on all pages
- [ ] Add related products section
- [ ] Improve site search functionality
- [ ] Add filters and sorting options
- [ ] Implement customer reviews

## ✅ Final Verification

Before launching:

- [ ] All URLs return appropriate status codes
- [ ] No 404 errors on important pages
- [ ] All forms work correctly
- [ ] Contact information is correct everywhere
- [ ] Privacy policy and terms of service exist
- [ ] Cookie consent implemented (if required)
- [ ] GDPR compliance (if serving EU customers)

After launching:

- [ ] Submit sitemap to search engines ✓
- [ ] Verify in search consoles ✓
- [ ] Test all SEO tools ✓
- [ ] Set up monitoring ✓
- [ ] Share on social media ✓

## 📞 Support & Resources

### Documentation

- SEO Implementation Guide: `frontend/docs/SEO_IMPLEMENTATION.md`
- SEO Summary: `frontend/docs/SEO_SITEMAP_SUMMARY.md`

### Tools Used

- Google Search Console
- Bing Webmaster Tools
- Google Analytics 4
- PageSpeed Insights
- Rich Results Test
- Mobile-Friendly Test

### Helpful Resources

- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Schema.org Documentation](https://schema.org/)
- [Web.dev](https://web.dev/) - Performance & SEO tips
- [Moz Beginner's Guide to SEO](https://moz.com/beginners-guide-to-seo)

---

**Last Updated**: October 11, 2025
**Status**: Ready for deployment
**Estimated Time**: 2-3 hours for complete setup
