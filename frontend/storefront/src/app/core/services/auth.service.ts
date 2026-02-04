import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, BehaviorSubject } from 'rxjs';
import { environment } from '@env/environment';

export interface User {
  id: string;
  email: string;
  displayNameAr: string;
  displayNameEn: string;
  phoneNumber?: string;
  role: 'Admin' | 'Staff' | 'Customer';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayNameAr: string;
  displayNameEn: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private currentUserSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);
  private isLoadingSignal = signal<boolean>(true);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly isAdmin = computed(() => this.currentUserSignal()?.role === 'Admin');
  readonly isStaff = computed(() => ['Admin', 'Staff'].includes(this.currentUserSignal()?.role || ''));

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor() {
    this.checkAuthStatus();
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.setAuthData(response.data);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of({ success: false, message: error.error?.message || 'Login failed' });
      })
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.setAuthData(response.data);
        }
      }),
      catchError(error => {
        console.error('Register error:', error);
        return of({ success: false, message: error.error?.message || 'Registration failed' });
      })
    );
  }

  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/ar']);
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return of({ success: false, message: 'No refresh token' });
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, { refreshToken }).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.setAuthData(response.data);
        } else {
          this.clearAuthData();
        }
      }),
      catchError(() => {
        this.clearAuthData();
        return of({ success: false, message: 'Token refresh failed' });
      })
    );
  }

  getAccessToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  private getRefreshToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('refreshToken');
    }
    return null;
  }

  private checkAuthStatus(): void {
    const token = this.getAccessToken();
    const userJson = isPlatformBrowser(this.platformId) ? localStorage.getItem('user') : null;

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        this.currentUserSignal.set(user);
        this.isAuthenticatedSignal.set(true);
      } catch {
        this.clearAuthData();
      }
    }
    this.isLoadingSignal.set(false);
  }

  private setAuthData(data: { user: User; accessToken: string; refreshToken: string; expiresAt: string }): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('tokenExpires', data.expiresAt);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    this.currentUserSignal.set(data.user);
    this.isAuthenticatedSignal.set(true);
  }

  private clearAuthData(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenExpires');
      localStorage.removeItem('user');
    }
    this.currentUserSignal.set(null);
    this.isAuthenticatedSignal.set(false);
  }
}
