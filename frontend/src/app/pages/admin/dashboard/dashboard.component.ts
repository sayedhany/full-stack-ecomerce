import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  menuItems = [
    { path: 'products', label: 'Products', icon: '📦' },
    { path: 'categories', label: 'Categories', icon: '🏷️' },
    { path: 'users', label: 'Users', icon: '👥' },
  ];

  logout(): void {
    this.authService.logout();
  }
}
