import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true;
  }

  // Get current language from URL
  const urlParts = state.url.split('/');
  const lang = urlParts[1] === 'ar' ? 'ar' : 'en';

  router.navigate([`/${lang}/admin/login`]);
  return false;
};
