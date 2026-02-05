import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { API_ENDPOINTS } from '@core/constant/api-endpoint';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  profileImagePath?: string;
  role: 'Admin' | 'Staff' | 'Customer';
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    userId: number;
    email: string;
    fullName: string;
    role: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  // Signals for reactive state management
  private currentUserSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);
  private isLoadingSignal = signal<boolean>(true);

  // Readonly signals exposed to components
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly isAdmin = computed(() => this.currentUserSignal()?.role === 'Admin');
  readonly isStaff = computed(() => {
    const role = this.currentUserSignal()?.role;
    return role === 'Admin' || role === 'Staff';
  });
  readonly isCustomer = computed(() => this.currentUserSignal()?.role === 'Customer');

  constructor() {
    this.checkAuthStatus();
  }


  login(request: LoginRequest): Observable<AuthResponse> {
    // Transform to PascalCase to match backend
    const backendRequest = {
      Email: request.email,
      Password: request.password
    };

    return this.http.post<AuthResponse>(API_ENDPOINTS.auth.login, backendRequest).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.setAuthData(response.data);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of({ 
          success: false, 
          message: error.error?.message || 'Login failed. Please check your credentials.' 
        });
      })
    );
  }


  register(request: RegisterRequest): Observable<AuthResponse> {
    // Transform to PascalCase to match backend
    const backendRequest = {
      FullName: request.fullName,
      Email: request.email,
      PhoneNumber: request.phoneNumber,
      Password: request.password,
      ConfirmPassword: request.confirmPassword
    };

    return this.http.post<AuthResponse>(API_ENDPOINTS.auth.register, backendRequest).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.setAuthData(response.data);
        }
      }),
      catchError(error => {
        console.error('Register error:', error);
        return of({ 
          success: false, 
          message: error.error?.message || 'Registration failed. Please try again.' 
        });
      })
    );
  }


  logout(): void {
    const refreshToken = this.getRefreshToken();
    
    if (refreshToken) {
      const backendRequest = {
        RefreshToken: refreshToken
      };

      this.http.post(API_ENDPOINTS.auth.revokeToken, backendRequest)
        .pipe(catchError(() => of(null)))
        .subscribe();
    }

    this.clearAuthData();
    this.router.navigate(['/']);
  }


  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      return of({ success: false, message: 'No refresh token available' });
    }

    const backendRequest = {
      RefreshToken: refreshToken
    };

    return this.http.post<AuthResponse>(
      API_ENDPOINTS.auth.refreshToken, 
      backendRequest
    ).pipe(
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


  changePassword(request: ChangePasswordRequest): Observable<AuthResponse> {
    const backendRequest = {
      CurrentPassword: request.currentPassword,
      NewPassword: request.newPassword,
      ConfirmNewPassword: request.confirmNewPassword
    };

    return this.http.post<AuthResponse>(
      API_ENDPOINTS.auth.changePassword, 
      backendRequest
    ).pipe(
      catchError(error => {
        console.error('Change password error:', error);
        return of({ 
          success: false, 
          message: error.error?.message || 'Failed to change password' 
        });
      })
    );
  }

  getCurrentUser(): Observable<{ success: boolean; data?: User; message?: string }> {
    return this.http.get<{ success: boolean; data?: User; message?: string }>(
      API_ENDPOINTS.auth.me
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.updateUserInfo(response.data);
        }
      }),
      catchError(error => {
        console.error('Get current user error:', error);
        return of({ 
          success: false, 
          message: error.error?.message || 'Failed to get user information' 
        });
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


  isTokenExpired(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const expiresAt = localStorage.getItem('tokenExpires');
      if (!expiresAt) return true;
      
      return new Date(expiresAt) <= new Date();
    }
    return true;
  }


  private checkAuthStatus(): void {
    const token = this.getAccessToken();
    const userJson = isPlatformBrowser(this.platformId) 
      ? localStorage.getItem('user') 
      : null;

    if (token && userJson && !this.isTokenExpired()) {
      try {
        const userData = JSON.parse(userJson);
        const user: User = {
          id: userData.userId || userData.id,
          fullName: userData.fullName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          profileImagePath: userData.profileImagePath,
          role: userData.role,
          isActive: userData.isActive ?? true,
          createdAt: userData.createdAt || new Date().toISOString()
        };
        
        this.currentUserSignal.set(user);
        this.isAuthenticatedSignal.set(true);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        this.clearAuthData();
      }
    } else if (token && this.isTokenExpired()) {
      // Try to refresh token if expired
      this.refreshToken().subscribe();
    }
    
    this.isLoadingSignal.set(false);
  }

  private setAuthData(data: {
    userId: number;
    email: string;
    fullName: string;
    role: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: string;
  }): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('tokenExpires', data.accessTokenExpires);
      
      const user: User = {
        id: data.userId,
        fullName: data.fullName,
        email: data.email,
        role: data.role as 'Admin' | 'Staff' | 'Customer',
        isActive: true,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSignal.set(user);
    }
    
    this.isAuthenticatedSignal.set(true);
  }


  private updateUserInfo(user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    this.currentUserSignal.set(user);
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