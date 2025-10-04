# Layout Architecture

## Overview

The application now uses a dual-layout architecture to provide different layouts for public pages and admin pages.

## Layout Components

### 1. PublicLayoutComponent

**Location**: `src/app/layouts/public-layout/public-layout.component.ts`

**Purpose**: Provides the standard layout with header and footer for public-facing pages.

**Structure**:

```
┌─────────────────────────┐
│      Header             │
├─────────────────────────┤
│                         │
│      Main Content       │
│    (router-outlet)      │
│                         │
├─────────────────────────┤
│      Footer             │
└─────────────────────────┘
```

**Used for**:

- Home page
- Product listing
- Product details
- Contact page

### 2. AdminLayoutComponent

**Location**: `src/app/layouts/admin-layout/admin-layout.component.ts`

**Purpose**: Provides a clean layout WITHOUT header and footer for admin pages.

**Structure**:

```
┌─────────────────────────┐
│                         │
│      Admin Content      │
│    (router-outlet)      │
│                         │
│                         │
└─────────────────────────┘
```

**Features**:

- No header or footer
- Clean admin-focused interface
- Full-height background (#f5f7fa)
- Minimal wrapper for admin dashboard and pages

**Used for**:

- Admin login
- Admin dashboard
- Products management
- Categories management
- Users management

## Route Structure

### Public Routes (with Header & Footer)

```typescript
{
  path: 'en',
  component: PublicLayoutComponent,
  children: [
    { path: '', component: HomeComponent },
    { path: 'product/:slug', component: ProductDetailsComponent },
    { path: 'contact', component: ContactComponent },
  ]
}
```

### Admin Routes (NO Header & Footer)

```typescript
{
  path: 'en/admin',
  component: AdminLayoutComponent,
  children: [
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent },
  ]
}
```

## URL Structure

### Public Pages (with header/footer):

- `/en` - Home
- `/en/product/some-product` - Product details
- `/en/contact` - Contact page
- `/ar` - Arabic home
- `/ar/product/some-product` - Arabic product details
- `/ar/contact` - Arabic contact page

### Admin Pages (without header/footer):

- `/en/admin/login` - Admin login (English)
- `/en/admin/dashboard` - Admin dashboard (English)
- `/en/admin/dashboard/products` - Products management
- `/en/admin/dashboard/categories` - Categories management
- `/en/admin/dashboard/users` - Users management
- `/ar/admin/login` - Admin login (Arabic)
- `/ar/admin/dashboard` - Admin dashboard (Arabic)
- etc.

## Benefits

✅ **Clean Admin Interface**: Admin pages have no header/footer distractions
✅ **Consistent Public Experience**: All public pages maintain the same header/footer
✅ **Better Separation**: Clear separation between public and admin areas
✅ **Performance**: Each layout only loads what it needs
✅ **Maintainability**: Easy to modify layout for each section independently
✅ **Scalability**: Easy to add more layout types in the future

## App Component

The root `AppComponent` now only contains a single `<router-outlet>` which renders either:

1. `PublicLayoutComponent` (which then shows header + content + footer)
2. `AdminLayoutComponent` (which shows only content)

This is controlled by the route configuration.

## Implementation Details

### app.component.html (Simplified)

```html
<router-outlet></router-outlet>
```

### app.routes.ts (Structured)

```typescript
export const routes: Routes = [
  // Public routes use PublicLayoutComponent
  { path: 'en', component: PublicLayoutComponent, children: [...] },
  { path: 'ar', component: PublicLayoutComponent, children: [...] },

  // Admin routes use AdminLayoutComponent
  { path: 'en/admin', component: AdminLayoutComponent, children: [...] },
  { path: 'ar/admin', component: AdminLayoutComponent, children: [...] },
];
```

## Testing

To verify the layout separation:

1. **Test Public Pages**: Visit `/en` or `/ar` - should see header and footer
2. **Test Admin Pages**: Visit `/en/admin/login` - should NOT see header/footer
3. **Navigation**: Navigate from public to admin - layout should change seamlessly
4. **Both Languages**: Test both English and Arabic routes for both layouts

## Future Enhancements

Possible future additions:

- **UserLayoutComponent**: For authenticated users (different from admin)
- **MobileLayoutComponent**: Optimized for mobile devices
- **PrintLayoutComponent**: For print-friendly pages
- **EmbedLayoutComponent**: For embedded/iframe content
