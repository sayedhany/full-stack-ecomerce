# Contact Information Configuration

This directory contains the centralized contact information configuration for the entire application.

## Overview

The `contact.config.ts` file provides a single source of truth for all contact-related information including phone numbers, emails, addresses, and social media links.

## Usage

### Import the Configuration

```typescript
import { CONTACT_INFO, getAllPhones, getWhatsAppLink } from "./config/contact.config";
```

### Access Contact Information

```typescript
// Get phone numbers
const mainPhone = CONTACT_INFO.phones.main;
const supportPhone = CONTACT_INFO.phones.support;
const salesPhone = CONTACT_INFO.phones.sales;
const whatsappPhone = CONTACT_INFO.phones.whatsapp;

// Get emails
const mainEmail = CONTACT_INFO.emails.main;
const supportEmail = CONTACT_INFO.emails.support;

// Get address
const fullAddress = CONTACT_INFO.address.full;
const city = CONTACT_INFO.address.city;

// Get social media
const facebookUrl = CONTACT_INFO.social.facebook;
const instagramUrl = CONTACT_INFO.social.instagram;
```

### Helper Functions

#### getAllPhones()

Returns an array of all phone numbers (main, support, sales) suitable for displaying in lists:

```typescript
const phoneNumbers = getAllPhones();
// Returns: [
//   { label: 'MAIN_LINE', number: '+20 127 778 2993', tel: '+201277782993' },
//   { label: 'SUPPORT', number: '+20 123 456 7890', tel: '+201234567890' },
//   { label: 'SALES', number: '+20 111 222 3333', tel: '+201112223333' }
// ]
```

#### getWhatsAppLink(message?)

Generates a WhatsApp link with an optional custom message:

```typescript
// With default message
const link = getWhatsAppLink();

// With custom message
const link = getWhatsAppLink("I want to order this product");
```

#### formatPhoneNumber(tel)

Formats a phone number for better display:

```typescript
const formatted = formatPhoneNumber("+201277782993");
// Returns: '+20 127 778 2993'
```

## Configuration Structure

```typescript
{
  companyName: string;
  phones: {
    main: { label, number, tel }
    support: { label, number, tel }
    sales: { label, number, tel }
    whatsapp: { label, number, tel }
  };
  emails: {
    main: string;
    support: string;
    sales?: string;
  };
  address: {
    street: string;
    city: string;
    country: string;
    full: string;
  };
  social: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
}
```

## Updating Contact Information

To update contact information for the entire application:

1. Open `frontend/src/app/config/contact.config.ts`
2. Modify the `CONTACT_INFO` object with your new information
3. Save the file
4. All components using this configuration will automatically reflect the changes

### Example: Update Phone Numbers

```typescript
export const CONTACT_INFO: ContactInfo = {
  // ... other config
  phones: {
    main: {
      label: "MAIN_LINE",
      number: "+20 100 123 4567", // ← Update this
      tel: "+201001234567", // ← Update this
    },
    // ... other phones
  },
  // ... rest of config
};
```

## Components Using This Configuration

The following components automatically use this centralized configuration:

- **CallButtonComponent** - Fixed call button with phone menu
- **FooterComponent** - Footer with contact information and social links
- **ProductCardComponent** - WhatsApp order integration

## Benefits

✅ **Single Source of Truth** - Update once, apply everywhere
✅ **Type Safety** - TypeScript interfaces ensure correctness
✅ **Easy Maintenance** - No need to search through multiple files
✅ **Consistent Data** - Same contact info across all components
✅ **Helper Functions** - Utility functions for common tasks

## Notes

- Phone numbers should be in international format (e.g., `+201277782993`)
- Display numbers can include spaces for readability (e.g., `+20 127 778 2993`)
- Social media URLs are optional (use `undefined` or remove the property if not needed)
- The `tel:` attribute is used for clickable phone links
- WhatsApp links use the `wa.me` format
