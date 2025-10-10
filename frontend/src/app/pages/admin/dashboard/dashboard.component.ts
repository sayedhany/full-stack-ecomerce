import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth.service';
import { LanguageService } from '../../../services/translation.service';
import { HeaderComponent } from '../../../components/header/header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, TranslateModule, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  authService = inject(AuthService);
  translationService = inject(LanguageService);

  // Sidebar state for mobile
  isSidebarOpen = signal(false);

  get currentLang(): string {
    return this.translationService.getCurrentLanguage();
  }

  menuItems = [
    { path: 'products', label: 'ADMIN.PRODUCTS_MANAGEMENT', icon: '📦' },
    { path: 'categories', label: 'ADMIN.CATEGORIES_MANAGEMENT', icon: '🏷️' },
    { path: 'users', label: 'ADMIN.USERS_MANAGEMENT', icon: '👥' },
  ];

  toggleSidebar(): void {
    this.isSidebarOpen.set(!this.isSidebarOpen());
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
  }
}
