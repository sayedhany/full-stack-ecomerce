import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Login Guard - Prevents authenticated users from accessing login page
 * Redirects already logged-in admin users to dashboard
 */
export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is already logged in and is admin
  if (authService.isLoggedIn() && authService.isAdmin()) {
    // Get current language from URL
    const urlParts = state.url.split('/');
    const lang = urlParts[1] === 'ar' ? 'ar' : 'en';

    // Redirect to dashboard
    router.navigate([`/${lang}/admin/dashboard`]);
    return false; // Prevent access to login page
  }

  // Allow access to login page if not logged in
  return true;
};
