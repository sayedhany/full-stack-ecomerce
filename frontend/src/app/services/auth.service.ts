import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private apiUrl = environment.apiUrl;

  currentUser = signal<User | null>(null);

  constructor() {
    this.loadCustomerFromStorage();
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((response) => {
          if (response.success) {
            this.setSession(response.token, response.user);
          }
        })
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('customer');
      // Get current language from URL
      const urlParts = this.router.url.split('/');
      const lang = urlParts[1] === 'ar' ? 'ar' : 'en';
      this.currentUser.set(null);
      this.router.navigate([`/${lang}/admin/login`]);
    } else {
      this.currentUser.set(null);
    }
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      return !!token;
    }
    return false;
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    return user?.role === 'admin';
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  private setSession(token: string, user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      localStorage.setItem('customer', JSON.stringify(user));
    }
    this.currentUser.set(user);
  }

  private loadCustomerFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const customerStr = localStorage.getItem('customer');
      if (customerStr) {
        try {
          this.currentUser.set(JSON.parse(customerStr));
        } catch (e) {
          console.error('Failed to parse customer from storage', e);
        }
      }
    }
  }
}
