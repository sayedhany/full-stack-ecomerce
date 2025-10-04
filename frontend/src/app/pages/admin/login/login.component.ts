import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LanguageService } from '../../../services/translation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private languageService = inject(LanguageService);

  email = signal('');
  password = signal('');
  error = signal('');
  loading = signal(false);

  get currentLang(): string {
    return this.languageService.getCurrentLanguage();
  }

  onEmailChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.email.set(value);
  }

  onPasswordChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.password.set(value);
  }

  onSubmit(): void {
    this.error.set('');
    this.loading.set(true);

    if (!this.email() || !this.password()) {
      this.error.set('Please enter both email and password');
      this.loading.set(false);
      return;
    }

    this.authService.login(this.email(), this.password()).subscribe({
      next: (response) => {
        this.loading.set(false);
        if (response.success && response.user.role === 'admin') {
          this.router.navigate([`/${this.currentLang}/admin/dashboard`]);
        } else {
          this.error.set('Access denied. Admin privileges required.');
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Invalid email or password');
      },
    });
  }
}
