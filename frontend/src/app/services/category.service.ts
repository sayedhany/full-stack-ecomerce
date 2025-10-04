import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, Category } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getCategories(): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(
      `${this.apiUrl}/api/categories`
    );
  }

  createCategory(
    category: any
  ): Observable<{ success: boolean; data: Category }> {
    // Generate slugs from names if not provided
    const categoryData = {
      ...category,
      slug: category.slug || {
        en: this.generateSlug(category.name.en),
        ar: this.generateSlug(category.name.ar),
      },
    };

    return this.http.post<{ success: boolean; data: Category }>(
      `${this.apiUrl}/api/categories`,
      categoryData
    );
  }

  updateCategory(
    id: string,
    category: any
  ): Observable<{ success: boolean; data: Category }> {
    // Generate slugs from names if not provided and names changed
    const categoryData = {
      ...category,
      slug:
        category.slug ||
        (category.name
          ? {
              en: this.generateSlug(category.name.en),
              ar: this.generateSlug(category.name.ar),
            }
          : undefined),
    };

    return this.http.put<{ success: boolean; data: Category }>(
      `${this.apiUrl}/api/categories/${id}`,
      categoryData
    );
  }

  deleteCategory(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(
      `${this.apiUrl}/api/categories/${id}`
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
