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
}
