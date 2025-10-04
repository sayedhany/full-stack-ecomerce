# EgyptFisher E-Commerce Frontend

A modern, bilingual (English/Arabic) e-commerce platform built with Angular 18 and Server-Side Rendering (SSR).

## 🚀 Features

- ✅ **Server-Side Rendering (SSR)** - Fast initial page load and SEO-friendly
- ✅ **Bilingual Support** - English and Arabic with RTL support
- ✅ **Dark/Light Mode** - User preference with system detection
- ✅ **Responsive Design** - Mobile, tablet, and desktop optimized
- ✅ **Modern UI** - Clean design with smooth animations
- ✅ **Product Catalog** - Browse products with filtering and search
- ✅ **Product Details** - Detailed product information pages
- ✅ **Contact Page** - Company contact information

## 🛠️ Tech Stack

- **Framework:** Angular 18.2.0 (Standalone Components)
- **SSR:** @angular/ssr
- **Translation:** @ngx-translate/core
- **Carousel:** Swiper 11.2.10
- **Styling:** SCSS with CSS Variables
- **Package Manager:** PNPM

## 📋 Prerequisites

- Node.js (v18 or higher)
- PNPM (v8 or higher)

## 🔧 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:

```bash
pnpm install
```

3. Configure environment:
   Edit `src/environments/environment.ts` and `src/environments/environment.development.ts` to set your API URL:

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:3000", // Change to your backend URL
};
```

## 🚀 Development

Start the development server:

```bash
npm start
# or
pnpm start
```

Navigate to `http://localhost:4200/en` (English) or `http://localhost:4200/ar` (Arabic)

## 🏗️ Build

### Production Build

```bash
pnpm run build
```

### SSR Build & Serve

```bash
pnpm run build
pnpm run serve:ssr:frontend
```

## 📁 Project Structure

```
src/
├── app/
│   ├── components/          # Shared components
│   │   ├── header/         # Header with navigation
│   │   └── footer/         # Footer component
│   ├── pages/              # Page components
│   │   ├── home/           # Home page with products
│   │   ├── product-details/ # Product detail page
│   │   └── contact/        # Contact page
│   ├── services/           # Services
│   │   ├── product.service.ts
│   │   ├── category.service.ts
│   │   ├── translation.service.ts
│   │   └── theme.service.ts
│   ├── models/             # TypeScript interfaces
│   │   └── product.model.ts
│   ├── app.component.*     # Root component
│   ├── app.routes.ts       # Routing configuration
│   └── app.config.ts       # App configuration
├── assets/
│   ├── i18n/              # Translation files
│   │   ├── en.json        # English translations
│   │   └── ar.json        # Arabic translations
│   └── styles/            # Global styles
│       ├── _reset.scss    # CSS reset
│       └── styles.scss    # Global styles & theme
└── environments/          # Environment configs

## 🎨 Theme

The project uses a two-color theme system:
- **Primary Color:** Blue (#2563eb)
- **Secondary Color:** Orange (#f97316)

### Dark/Light Mode
Theme automatically detects system preference and can be toggled via the theme button in the header.

## 🌐 Internationalization

### Supported Languages
- English (en)
- Arabic (ar) with RTL support

### Adding Translations
Edit the JSON files in `src/assets/i18n/`:
- `en.json` - English translations
- `ar.json` - Arabic translations

### Language Routing
- English: `/en/...`
- Arabic: `/ar/...`

Language switching triggers a full page reload to ensure SSR translations work correctly.

## 📱 Responsive Breakpoints

- **Mobile:** < 480px
- **Tablet:** 480px - 768px
- **Desktop:** 768px - 1024px
- **Large Desktop:** > 1024px

## 🔌 API Integration

### Products API
```

GET {{baseUrl}}/api/products

```
Returns a list of products with localized names, descriptions, and slugs.

### Categories API
```

GET {{baseUrl}}/api/categories

```
Returns a list of categories with localized names.

### Product Details API
```

GET {{baseUrl}}/api/products/:slug

````
Returns detailed information for a specific product.

## 🎯 Key Features

### Home Page
- Hero carousel with Swiper
- Product search functionality
- Category filtering
- Responsive product grid

### Product Details
- Large product image
- Localized product information
- Category display
- Add to cart button

### Contact Page
- Email contact
- Phone number
- Location information
- Company information

## 🔍 SEO

The project uses Angular SSR to provide:
- Fast initial page load
- Server-rendered content for search engines
- Meta tags support
- Proper heading structure

## 🚀 Performance

- Lazy loading for routes
- Optimized images
- CSS minification
- Tree shaking
- AOT compilation

## 📝 Scripts

```json
{
  "start": "ng serve",
  "build": "ng build",
  "watch": "ng build --watch --configuration development",
  "test": "ng test",
  "serve:ssr:frontend": "node dist/frontend/server/server.mjs"
}
````

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Contact

**EgyptFisher**

- Email: info@egyptfisher.com
- Phone: +20 123 456 7890
- Location: Cairo, Egypt

---

Built with ❤️ using Angular 18
