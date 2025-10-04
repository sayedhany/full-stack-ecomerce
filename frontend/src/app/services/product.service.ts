import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getProducts(
    page: number = 1,
    limit: number = 10
  ): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(
      `${this.apiUrl}/api/products?page=${page}&limit=${limit}`
    );
  }

  getProductBySlug(slug: string): Observable<{ data: Product }> {
    return this.http.get<{ data: Product }>(
      `${this.apiUrl}/api/products/${slug}`
    );
  }

  createProduct(product: any): Observable<{ success: boolean; data: Product }> {
    // Generate slugs from names if not provided
    const productData = {
      ...product,
      slug: product.slug || {
        en: this.generateSlug(product.name.en),
        ar: this.generateSlug(product.name.ar),
      },
    };

    return this.http.post<{ success: boolean; data: Product }>(
      `${this.apiUrl}/api/products`,
      productData
    );
  }

  updateProduct(
    id: string,
    product: any
  ): Observable<{ success: boolean; data: Product }> {
    // Generate slugs from names if not provided and names changed
    const productData = {
      ...product,
      slug:
        product.slug ||
        (product.name
          ? {
              en: this.generateSlug(product.name.en),
              ar: this.generateSlug(product.name.ar),
            }
          : undefined),
    };

    return this.http.put<{ success: boolean; data: Product }>(
      `${this.apiUrl}/api/products/${id}`,
      productData
    );
  }

  deleteProduct(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(
      `${this.apiUrl}/api/products/${id}`
    );
  }

  createProductWithImage(
    formData: FormData
  ): Observable<{ success: boolean; data: Product }> {
    return this.http.post<{ success: boolean; data: Product }>(
      `${this.apiUrl}/api/products/with-image`,
      formData
    );
  }

  updateProductWithImage(
    id: string,
    formData: FormData
  ): Observable<{ success: boolean; data: Product }> {
    return this.http.put<{ success: boolean; data: Product }>(
      `${this.apiUrl}/api/products/${id}`,
      formData
    );
  }

  private generateSlug(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\u0600-\u06FFa-z0-9\-]/g, '') // Remove invalid chars (keep Arabic, English, numbers, and -)
      .replace(/-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start
      .replace(/-+$/, ''); // Trim - from end
  }
}
