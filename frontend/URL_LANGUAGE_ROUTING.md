# URL-Based Language Routing with SSR

## How It Works

### URL Structure

- **English**: `http://localhost:4200/en` or `http://localhost:4200/en/products`
- **Arabic**: `http://localhost:4200/ar` or `http://localhost:4200/ar/products`
- **Default** (no language prefix): Defaults to English or cookie preference

### Language Detection Priority (Server)

1. **URL Path**: `/en/...` or `/ar/...` (highest priority)
2. **Cookie**: `app-language` cookie value
3. **Default**: Falls back to `en`

### Language Switching Flow

#### 1. Visit `/` (root)

- Server detects no language in URL
- Checks cookie → finds `en` (or defaults to `en`)
- Renders page with English translations
- HTML source: `<html lang="en" dir="ltr">`

#### 2. Click "العربية" Button

```
Current URL: /
↓
LanguageService.setLanguage('ar') called
↓
Cookie set: app-language=ar
↓
Navigate to: /ar
↓
Server receives request for /ar
↓
Server detects language from URL: 'ar'
↓
Server loads ar.json translations
↓
Server renders with Arabic content
↓
Browser shows: /ar with Arabic content
↓
View Source: <html lang="ar" dir="rtl"> ✅
```

#### 3. Navigate to Sub-Pages

```
Click a link while on /ar
↓
Navigate to: /ar/products
↓
Server detects 'ar' from URL
↓
Renders /ar/products with Arabic
```

#### 4. Click "English" Button

```
Current URL: /ar or /ar/products
↓
LanguageService.setLanguage('en') called
↓
Removes 'ar' from path
↓
Adds 'en' to path
↓
Navigate to: /en or /en/products
↓
Server renders with English
```

## Implementation Details

### LanguageService (`language.service.ts`)

**Key Methods:**

1. **`getLanguagePrefixedUrl(currentUrl, newLang)`**

   - Removes existing language prefix (`/ar/products` → `/products`)
   - Adds new language prefix (`/products` → `/en/products`)

2. **`getStoredLanguage()`**

   - Checks URL first: `window.location.pathname`
   - Then checks cookie
   - Falls back to default

3. **`setLanguage(lang, navigate)`**
   - Sets cookie
   - Navigates to new language-prefixed URL
   - Uses `window.location.href` for full page navigation (triggers SSR)

### Server (`server.ts`)

**Language Detection:**

```typescript
const urlSegments = relativeUrl.split("/").filter((s) => s);
const langSegment = urlSegments[0];

if (supportedLanguages.includes(langSegment)) {
  language = langSegment; // e.g., 'ar'
} else {
  // Check cookie as fallback
  language = req.cookies["app-language"] || "en";
}
```

**Translation Loading:**

```typescript
const translationPath = join(browserDistFolder, "assets", "i18n", `${language}.json`);
const translations = JSON.parse(readFileSync(translationPath, "utf8"));
```

**HTML Modification:**

```typescript
if (language === "ar") {
  html = html.replace("<html", '<html lang="ar" dir="rtl"');
} else {
  html = html.replace("<html", '<html lang="en" dir="ltr"');
}
```

## Testing

### Development Server

```bash
npm start
```

Visit:

- `http://localhost:4200` → Defaults to English
- `http://localhost:4200/en` → English
- `http://localhost:4200/ar` → Arabic

### SSR Build

```bash
pnpm run build
pnpm run serve:ssr:frontend
```

Visit:

- `http://localhost:4000` → Defaults to English
- `http://localhost:4000/en` → English (View Source shows English)
- `http://localhost:4000/ar` → Arabic (View Source shows Arabic)

### Verify SSR is Working

1. **Visit**: `http://localhost:4000/ar`
2. **Right-click** → View Page Source
3. **Look for**:
   ```html
   <html lang="ar" dir="rtl"></html>
   ```
4. **See translated content** in the HTML source (not just in the browser)

## URL Examples

| Action        | Current URL    | New URL        | Server Renders |
| ------------- | -------------- | -------------- | -------------- |
| Click العربية | `/`            | `/ar`          | Arabic HTML    |
| Click العربية | `/en`          | `/ar`          | Arabic HTML    |
| Click English | `/ar`          | `/en`          | English HTML   |
| Click العربية | `/en/products` | `/ar/products` | Arabic HTML    |
| Direct visit  | -              | `/ar/about`    | Arabic HTML    |

## Benefits

✅ **SEO-Friendly**: Each language has its own URL  
✅ **Shareable Links**: `/ar/products` always shows Arabic  
✅ **SSR Support**: Server renders in correct language  
✅ **Browser History**: Back/forward buttons work correctly  
✅ **Cookie Persistence**: Language preference remembered  
✅ **No Flash**: Content rendered server-side in correct language
