export interface LocalizedText {
  en: string;
  ar: string;
}

export interface Category {
  _id: string;
  name: LocalizedText;
  slug: LocalizedText;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Product {
  _id: string;
  name: LocalizedText;
  description: LocalizedText;
  slug: LocalizedText;
  price: number;
  image: string;
  category: Category;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApiResponse<T> {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: T[];
}
