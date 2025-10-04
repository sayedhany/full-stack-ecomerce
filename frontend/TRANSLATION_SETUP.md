# NGX-Translate Setup - Arabic & English Support

## Overview

Your Angular application now supports internationalization (i18n) with Arabic and English languages using ngx-translate.

## Installation

The following packages have been installed:

- `@ngx-translate/core@17.0.0`
- `@ngx-translate/http-loader@17.0.0`

## Configuration

### Translation Files

Located in `src/assets/i18n/`:

- `en.json` - English translations
- `ar.json` - Arabic translations

### App Configuration

The `app.config.ts` has been updated with:

- Custom TranslateLoader that loads JSON files from `/assets/i18n/`
- Default language set to 'en'
- HttpClient with fetch API support

### App Component

The `app.component.ts` includes:

- Language switcher functionality
- RTL/LTR direction support for Arabic
- Default language initialization

## Usage

### In Templates (HTML)

Use the `translate` pipe:

```html
<h1>{{ 'WELCOME' | translate }}</h1>
<p>{{ 'HOME' | translate }}</p>
```

### In Components (TypeScript)

Inject TranslateService:

```typescript
import { TranslateService } from '@ngx-translate/core';

constructor(private translate: TranslateService) {}

// Switch language
this.translate.use('ar');

// Get translation
this.translate.get('WELCOME').subscribe((text: string) => {
  console.log(text);
});

// Instant translation
const text = this.translate.instant('WELCOME');
```

## Adding New Translations

1. Add keys to `src/assets/i18n/en.json`:

```json
{
  "NEW_KEY": "English text"
}
```

2. Add the same keys to `src/assets/i18n/ar.json`:

```json
{
  "NEW_KEY": "النص بالعربية"
}
```

## Language Switching

The app component includes a language switcher that:

- Switches between English and Arabic
- Updates the document direction (LTR/RTL)
- Updates the document language attribute

## RTL Support

When Arabic is selected:

- `document.documentElement.dir` is set to 'rtl'
- CSS supports RTL layout with `[dir="rtl"]` selector

## SSR Compatibility

The translation system is fully compatible with Angular SSR and will work on both server and client sides.

## Testing

Run the development server to see the translation in action:

```bash
pnpm start
```

Click the language switcher buttons to toggle between English and Arabic.
