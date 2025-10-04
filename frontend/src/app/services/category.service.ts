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
}
