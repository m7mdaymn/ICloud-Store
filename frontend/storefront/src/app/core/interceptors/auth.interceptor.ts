import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
/**
 * HTTP Interceptor that:
 * 1. Adds Authorization header with access token to all requests
 * 2. Handles 401 errors by attempting to refresh the token
 * 3. Redirects to login if token refresh fails
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Get the access token
  const token = authService.getAccessToken();

  // Clone request and add Authorization header if token exists
  let authReq = req;
  if (token && !req.url.includes('/auth/login') && !req.url.includes('/auth/register')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Send the request and handle errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized errors
      if (error.status === 401 && !req.url.includes('/auth/refresh-token')) {
        // Try to refresh the token
        return authService.refreshToken().pipe(
          switchMap((response) => {
            if (response.success && response.data) {
              // Retry the original request with new token
              const newToken = response.data.accessToken;
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next(retryReq);
            } else {
              // Token refresh failed, redirect to login
              router.navigate(['/login']);
              return throwError(() => error);
            }
          }),
          catchError((refreshError) => {
            // Token refresh failed, redirect to login
            router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );
      }

      // For other errors, just pass them through
      return throwError(() => error);
    })
  );
};