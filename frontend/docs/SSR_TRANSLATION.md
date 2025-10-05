# SSR Translation Setup

## Overview

Your Angular application now supports Server-Side Rendering (SSR) with ngx-translate for both Arabic and English languages.

## How It Works

### Client-Side (Browser)

- Uses `UniversalTranslateLoader` that loads translations via HTTP
- Checks `TransferState` first to see if translations were already loaded on the server
- If available in TransferState, uses cached data (avoids duplicate HTTP requests)

### Server-Side (SSR)

- Uses `ServerTranslateLoader` that reads translation files directly from the file system
- Stores loaded translations in `TransferState` for client hydration
- Supports multiple file paths for different build scenarios (dev/prod)

## Configuration Files

### app.config.ts

- Configures `UniversalTranslateLoader` for client
- Includes `TransferState` for state transfer between server and client
- Uses `provideClientHydration` with HTTP transfer cache

### app.config.server.ts

- Configures `ServerTranslateLoader` for server-side rendering
- Overrides the client loader with server-specific implementation
- Merges with client config

### server-translate.loader.ts

- Custom loader that reads JSON files from the file system
- Tries multiple paths to find translation files
- Stores data in `TransferState` for client hydration

## Building and Running

### Development (Client-side only)

```bash
pnpm start
```

### Build for SSR

```bash
pnpm run build
```

### Run SSR Server

```bash
pnpm run serve:ssr:frontend
```

The server will run on `http://localhost:4000` with:

- Server-side rendered pages with translations
- Pre-loaded translation data transferred to client
- No duplicate HTTP requests for translations on client hydration

## Translation Flow

1. **Server renders page**:

   - `ServerTranslateLoader` reads `en.json` or `ar.json` from file system
   - Translations applied on the server
   - Data stored in `TransferState`

2. **HTML sent to browser**:

   - Page includes rendered content with translations
   - `TransferState` data embedded in HTML

3. **Client hydration**:
   - `UniversalTranslateLoader` checks `TransferState`
   - Finds translation data already available
   - No HTTP request needed - uses cached data
   - App becomes interactive

## Benefits

- ✅ SEO-friendly translated content (rendered on server)
- ✅ Fast initial page load with pre-rendered translations
- ✅ No flash of untranslated content (FOUC)
- ✅ No duplicate HTTP requests for translations
- ✅ Works with both languages (Arabic RTL and English LTR)
- ✅ Proper hydration without content mismatch

## Testing

1. Build the app: `pnpm run build`
2. Run SSR server: `pnpm run serve:ssr:frontend`
3. Open `http://localhost:4000`
4. View page source - you should see translated text in HTML
5. Switch languages - translations load instantly from cache
6. Check Network tab - no duplicate requests for translation files
