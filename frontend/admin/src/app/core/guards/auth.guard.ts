import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.getToken()) {
    router.navigate(['/login']);
    return false;
  }
  
  if (authService.isTokenExpired()) {
    // Token is expired, try to refresh
    authService.refreshToken().subscribe({
      next: () => {
        return true;
      },
      error: () => {
        router.navigate(['/login']);
        return false;
      }
    });
  }
  
  // Check if user has admin or staff role
  const user = authService.currentUser();
  if (user && (user.role === 'Admin' || user.role === 'Staff')) {
    return true;
  }
  
  router.navigate(['/login']);
  return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.isAdmin()) {
    router.navigate(['/dashboard']);
    return false;
  }
  
  return true;
};
