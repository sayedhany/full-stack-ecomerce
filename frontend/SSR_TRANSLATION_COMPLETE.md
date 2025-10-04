# SSR Translation Setup - Complete

## Overview

Your Angular app now supports Server-Side Rendering with translations for English and Arabic, similar to the example project you provided.

## How It Works

### Server-Side (server.ts)

1. **URL Detection**: Detects language from URL path (`/en` or `/ar`)
2. **Load Translations**: Reads translation JSON files from file system
3. **Provide to Angular**: Injects translations via:
   - `TRANSLATIONS` token
   - `CURRENT_LANGUAGE` token
   - `LOCALE_ID` token
4. **HTML Modification**: Sets `<html lang="..." dir="...">`

### Client-Side (TranslationService)

1. **Constructor Initialization**: Receives server-provided translations
2. **Immediate Use**: Uses server translations (no HTTP request)
3. **URL Routing**: Listens to route changes for language switching
4. **DOM Updates**: Updates HTML attributes for language/direction

## File Structure

```
src/
├── app/
│   ├── services/
│   │   └── translation.service.ts    ← Main translation service
│   ├── app.component.ts               ← Uses TranslationService
│   ├── app.config.ts                  ← Simple HTTP loader
│   ├── app.routes.ts                  ← Routes with /en and /ar
│   └── assets/
│       └── i18n/
│           ├── en.json                ← English translations
│           └── ar.json                ← Arabic translations
server.ts                              ← SSR server with translation loading
```

## URLs

- `http://localhost:4200` → Redirects to `/en`
- `http://localhost:4200/en` → English content
- `http://localhost:4200/ar` → Arabic content

## Server Translation Flow

```
User requests: /ar
       ↓
Server detects language: 'ar'
       ↓
Server loads: assets/i18n/ar.json
       ↓
Server provides to Angular:
  - LOCALE_ID: 'ar-SA'
  - CURRENT_LANGUAGE: 'ar'
  - TRANSLATIONS: { ...ar.json content }
       ↓
TranslationService receives in constructor
       ↓
TranslationService.setTranslation('ar', translations)
       ↓
TranslationService.use('ar')
       ↓
Angular renders with Arabic
       ↓
HTML output: <html lang="ar" dir="rtl">
       ↓
Client receives pre-translated HTML ✅
```

## Language Switching

When user clicks language button:

```
Current URL: /en
       ↓
User clicks "العربية"
       ↓
TranslationService.switchLanguage('ar')
       ↓
Navigate to: /ar
       ↓
Server renders new page with Arabic
       ↓
Browser shows Arabic content
```

## Benefits

✅ **SEO-Friendly**: Search engines see translated content  
✅ **No FOUC**: Content rendered server-side in correct language  
✅ **Fast Initial Load**: No wait for translation files  
✅ **Shareable URLs**: `/ar/...` always shows Arabic  
✅ **RTL Support**: Automatic direction switching

## Testing

### Development

```bash
npm start
```

Visit:

- `http://localhost:4200/en` → English
- `http://localhost:4200/ar` → Arabic

### Production SSR

```bash
pnpm run build
pnpm run serve:ssr:frontend
```

Visit:

- `http://localhost:4000/ar`
- View Page Source
- See: `<html lang="ar" dir="rtl">`
- See Arabic content in HTML source ✅

## Translation Files

### en.json

```json
{
  "WELCOME": "Welcome",
  "HOME": "Home",
  "PRODUCTS": "Products",
  "CART": "Cart",
  "CHECKOUT": "Checkout",
  "LANGUAGE": "Language"
}
```

### ar.json

```json
{
  "WELCOME": "مرحباً",
  "HOME": "الرئيسية",
  "PRODUCTS": "المنتجات",
  "CART": "السلة",
  "CHECKOUT": "الدفع",
  "LANGUAGE": "اللغة"
}
```

## Usage in Components

```typescript
import { TranslateModule } from '@ngx-translate/core';

@Component({
  imports: [TranslateModule],
  template: `
    <h1>{{ 'WELCOME' | translate }}</h1>
  `
})
```

## API

### TranslationService

```typescript
// Inject service
translationService = inject(LanguageService);

// Get current language
const lang = this.translationService.getCurrentLanguage(); // 'en' | 'ar'

// Switch language (navigates to new URL)
this.translationService.setLanguage("ar");
```

## Server Configuration

The server.ts already handles:

- URL language detection
- Translation file loading
- Provider injection
- HTML attribute modification
- Hreflang tags

No changes needed to server.ts!

## Console Output

When working correctly, you'll see:

**Server:**

```
SSR: Rendering /ar with locale: ar-SA, language: ar
```

**Browser:**

```
Language detection: {url: 'ar', server: 'ar', locale: 'ar-SA', final: 'ar'}
SSR: Using server-provided translations for ar
Initial language loaded: ar
DOM updated - Language: ar, Dir: rtl
```

## Troubleshooting

If translations don't work:

1. Check translation files exist in `src/assets/i18n/`
2. Check server console for translation loading errors
3. Check browser console for language detection logs
4. Verify routes are set up with `/en` and `/ar`
5. Build and test with SSR: `pnpm run build && pnpm run serve:ssr:frontend`

## Next Steps

Add more routes under `/en` and `/ar`:

```typescript
export const routes: Routes = [
  {
    path: "en",
    children: [
      { path: "products", component: ProductsComponent },
      { path: "about", component: AboutComponent },
    ],
  },
  {
    path: "ar",
    children: [
      { path: "products", component: ProductsComponent },
      { path: "about", component: AboutComponent },
    ],
  },
];
```

All routes automatically get the correct language context!
