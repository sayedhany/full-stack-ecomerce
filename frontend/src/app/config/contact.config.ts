/**
 * Contact Information Configuration
 * Update all contact details here and they will be reflected throughout the application
 */

export interface ContactInfo {
  companyName: string;
  phones: {
    main: {
      label: string;
      number: string;
      tel: string;
    };
    support: {
      label: string;
      number: string;
      tel: string;
    };
    sales: {
      label: string;
      number: string;
      tel: string;
    };
    whatsapp: {
      label: string;
      number: string;
      tel: string;
    };
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

export const CONTACT_INFO: ContactInfo = {
  companyName: 'EgyptFisher',

  phones: {
    main: {
      label: 'MAIN_LINE',
      number: '+20 127 778 2993',
      tel: '+201277782993',
    },
    support: {
      label: 'SUPPORT',
      number: '+20 123 456 7890',
      tel: '+201234567890',
    },
    sales: {
      label: 'SALES',
      number: '+20 111 222 3333',
      tel: '+201112223333',
    },
    whatsapp: {
      label: 'WHATSAPP',
      number: '+20 127 778 2993',
      tel: '+201277782993',
    },
  },

  emails: {
    main: 'info@egypt-fisher.com',
    support: 'support@egypt-fisher.com',
    sales: 'sales@egypt-fisher.com',
  },

  address: {
    street: 'Main Street, Building 123',
    city: 'Cairo',
    country: 'Egypt',
    full: 'Cairo, Egypt - Main Street, Building 123',
  },

  social: {
    facebook: 'https://facebook.com/egyptfisher',
    twitter: 'https://twitter.com/egyptfisher',
    instagram: 'https://instagram.com/egyptfisher',
    linkedin: 'https://linkedin.com/company/egyptfisher',
    youtube: 'https://youtube.com/egyptfisher',
  },
};

/**
 * Helper function to get all phone numbers as an array
 */
export function getAllPhones() {
  return [
    CONTACT_INFO.phones.main,
    CONTACT_INFO.phones.support,
    CONTACT_INFO.phones.sales,
  ];
}

/**
 * Helper function to get WhatsApp link
 */
export function getWhatsAppLink(message?: string): string {
  const defaultMessage = 'Hello, I would like to inquire about your products';
  return `https://wa.me/${
    CONTACT_INFO.phones.whatsapp.tel
  }?text=${encodeURIComponent(message || defaultMessage)}`;
}

/**
 * Helper function to format phone number for display
 */
export function formatPhoneNumber(tel: string): string {
  // Remove + and format as +XX XXX XXX XXXX
  const cleaned = tel.replace(/\D/g, '');
  if (cleaned.length === 12) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(
      5,
      8
    )} ${cleaned.slice(8)}`;
  }
  return tel;
}
