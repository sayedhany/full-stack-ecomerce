# Admin Bilingual Support

## Overview

All admin components now support both Arabic (AR) and English (EN) translations using `@ngx-translate/core`.

## Implementation Details

### Translation Files Updated

#### English (`src/assets/i18n/en.json`)

Added complete `ADMIN` section with 40+ translation keys:

- Authentication: LOGIN, LOGOUT, EMAIL_LABEL, PASSWORD_LABEL, etc.
- Management: PRODUCTS_MANAGEMENT, CATEGORIES_MANAGEMENT, USERS_MANAGEMENT
- Actions: ADD_PRODUCT, EDIT_PRODUCT, DELETE_PRODUCT_CONFIRM, etc.
- Form Fields: NAME_EN, NAME_AR, DESCRIPTION_EN, DESCRIPTION_AR, IMAGE_URL, PRICE
- Buttons: CANCEL, CREATE, UPDATE, SAVE
- Table Headers: ACTIONS, IMAGE, NAME, ROLE
- Loading States: LOADING_PRODUCTS, LOADING_CATEGORIES, LOADING_USERS
- Validation: REQUIRED_FIELD, INVALID_EMAIL, MIN_PRICE
- User Roles: USER, ADMIN_ROLE
- Pagination: PAGE, PASSWORD_OPTIONAL

#### Arabic (`src/assets/i18n/ar.json`)

Added complete `ADMIN` section with Arabic translations for all keys.

### Components Updated

#### 1. LoginComponent

- **Path**: `src/app/pages/admin/login/`
- **Changes**:
  - Imported `TranslateModule`
  - Replaced hardcoded text with translation keys
  - Translated: page title, labels, button text, loading state

#### 2. DashboardComponent

- **Path**: `src/app/pages/admin/dashboard/`
- **Changes**:
  - Imported `TranslateModule`
  - Updated menu item labels to use translation keys
  - Translated: dashboard title, logout button
  - Menu items now show localized text based on current language

#### 3. AdminProductsComponent (Reactive Forms)

- **Path**: `src/app/pages/admin/admin-products/`
- **Changes**:
  - Imported `TranslateModule`
  - Translated all UI elements:
    - Page header and add button
    - Table headers (Image, Name EN/AR, Category, Price, Actions)
    - Modal title (Add/Edit Product)
    - Form labels (Name, Description, Category, Price, Image URL)
    - Validation error messages
    - Action buttons (Cancel, Create, Update)
    - Pagination (Previous, Next, Page X of Y)
    - Loading state

#### 4. AdminCategoriesComponent

- **Path**: `src/app/pages/admin/admin-categories/`
- **Changes**:
  - Imported `TranslateModule`
  - Translated all UI elements:
    - Page header and add button
    - Table headers (Name EN, Name AR, Actions)
    - Modal title (Add/Edit Category)
    - Form labels
    - Action buttons
    - Loading state

#### 5. AdminUsersComponent

- **Path**: `src/app/pages/admin/admin-users/`
- **Changes**:
  - Imported `TranslateModule`
  - Translated all UI elements:
    - Page header and add button
    - Table headers (Name, Email, Role, Actions)
    - Role badges (User, Admin)
    - Modal title (Add/Edit User)
    - Form labels (Name, Email, Password, Role)
    - Password optional hint for edit mode
    - Action buttons
    - Pagination
    - Loading state

## Usage

### Accessing Admin in Different Languages

**English Admin:**

```
http://localhost:4200/en/admin/login
http://localhost:4200/en/admin/dashboard
```

**Arabic Admin:**

```
http://localhost:4200/ar/admin/login
http://localhost:4200/ar/admin/dashboard
```

### Language Switching

The admin interface will automatically use the language from the URL (`/en/` or `/ar/`). All text, labels, buttons, and messages will be displayed in the selected language.

## Translation Keys Structure

All admin translation keys are nested under the `ADMIN` namespace:

```json
{
  "ADMIN": {
    "LOGIN": "Login",
    "PRODUCTS_MANAGEMENT": "Products Management",
    "NAME_EN": "Name (English)",
    ...
  }
}
```

### Usage in Templates

```html
{{ 'ADMIN.LOGIN' | translate }} {{ 'ADMIN.PRODUCTS_MANAGEMENT' | translate }} {{ editingProduct() ? ('ADMIN.EDIT_PRODUCT' | translate) : ('ADMIN.ADD_PRODUCT' | translate) }}
```

## Testing

To test bilingual support:

1. Navigate to `/en/admin/login` - all text should be in English
2. Navigate to `/ar/admin/login` - all text should be in Arabic
3. Switch between languages while navigating admin sections
4. Verify form validation messages appear in the correct language
5. Check that dynamic content (Add vs Edit) translates correctly
6. Test pagination and loading states in both languages

## Benefits

✅ **Fully Localized**: All admin UI text supports both languages
✅ **Consistent Experience**: Users see the admin interface in their preferred language
✅ **Dynamic Switching**: Language changes based on URL structure
✅ **Maintainable**: All translations centralized in JSON files
✅ **Extensible**: Easy to add more languages by creating new JSON files
✅ **User-Friendly**: Error messages, validation, and help text all localized

## Next Steps

If you need to add more translations:

1. Add keys to both `en.json` and `ar.json`
2. Use the `translate` pipe in templates: `{{ 'KEY' | translate }}`
3. For programmatic translation, inject `TranslateService` and use `translate.instant('KEY')`
