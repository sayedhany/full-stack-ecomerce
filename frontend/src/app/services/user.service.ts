import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './auth.service';
import { ApiResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5000/api/auth';

  getUsers(
    page: number = 1,
    limit: number = 10
  ): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(
      `${this.apiUrl}/users?page=${page}&limit=${limit}`
    );
  }

  getUserById(id: string): Observable<{ success: boolean; data: User }> {
    return this.http.get<{ success: boolean; data: User }>(
      `${this.apiUrl}/users/${id}`
    );
  }

  createUser(
    user: Partial<User>
  ): Observable<{ success: boolean; data: User }> {
    return this.http.post<{ success: boolean; data: User }>(
      `${this.apiUrl}/admin/create`,
      user
    );
  }

  updateUser(
    id: string,
    user: Partial<User>
  ): Observable<{ success: boolean; data: User }> {
    return this.http.put<{ success: boolean; data: User }>(
      `${this.apiUrl}/users/${id}`,
      user
    );
  }

  deleteUser(id: string): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/users/${id}`);
  }
}
