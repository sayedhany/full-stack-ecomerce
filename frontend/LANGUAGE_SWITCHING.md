# Language Switching with SSR

## How It Works

The language switching implementation now properly supports SSR with the following flow:

### 1. Initial Load

- `APP_INITIALIZER` runs before app bootstraps
- `LanguageService.initLanguage()` checks localStorage for saved language
- If found, uses that language; otherwise uses default (English)
- Language is applied BEFORE the app renders

### 2. Language Switch

- User clicks language button (English/العربية)
- `LanguageService.setLanguage()` is called:
  - Saves new language to localStorage
  - Updates document attributes (dir, lang)
  - **Reloads the page** to get fresh SSR content

### 3. Page Reload After Switch

- Browser requests new page from server
- Server reads the stored language preference (via localStorage after hydration)
- Server renders page in the correct language
- **View Source now shows content in the selected language**

## Files Modified

### `src/app/services/language.service.ts` (NEW)

Centralized language management service with:

- Language initialization
- Language switching
- localStorage persistence
- Document attribute updates

### `src/app/app.config.ts`

Added `APP_INITIALIZER` to:

- Initialize language before app starts
- Ensure SSR uses correct language

### `src/app/app.component.ts`

Simplified to use `LanguageService`:

- No direct TranslateService usage
- Delegates to LanguageService
- Clean component code

## Testing

1. **Start dev server**: `npm start`
2. **Visit**: `http://localhost:4200`
3. **View source**: See English content
4. **Click "العربية"**: Page reloads
5. **View source again**: See Arabic content (RTL)
6. **Refresh page**: Still shows Arabic (persisted)
7. **Click "English"**: Page reloads back to English

## Why Page Reload?

For SSR to show the correct language in "View Source":

- The server needs to render the page in that language
- This requires a fresh request to the server
- Client-side language switching alone won't affect SSR output
- Page reload ensures SSR content matches selected language

## Without Reload

If you don't want page reloads, you would need:

- URL-based language routing (e.g., `/en/products`, `/ar/products`)
- Or server-side detection via cookies/headers
- Or accept that "View Source" won't match client language
