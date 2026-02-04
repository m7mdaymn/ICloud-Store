import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, BehaviorSubject } from 'rxjs';
import { environment } from '@environments/environment';

export interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Backend response structure
export interface AuthResponseDto {
  userId: number;
  email: string;
  fullName: string;
  role: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// JWT Payload interface
interface JwtPayload {
  [key: string]: any;
  exp?: number;
  sub?: string;
  email?: string;
  role?: string;
  roles?: string | string[];
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string | string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'admin_access_token';
  private readonly REFRESH_TOKEN_KEY = 'admin_refresh_token';
  private readonly USER_KEY = 'admin_user';
  
  private userSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  user$ = this.userSubject.asObservable();
  
  currentUser = signal<User | null>(this.getStoredUser());
  isLoggedIn = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'Admin');
  isStaff = computed(() => this.currentUser()?.role === 'Staff' || this.isAdmin());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: LoginRequest): Observable<ApiResponse<AuthResponseDto>> {
    return this.http.post<ApiResponse<AuthResponseDto>>(`${environment.apiUrl}/Auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setSession(response.data);
          }
        }),
        catchError(error => {
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<ApiResponse<AuthResponseDto>> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<ApiResponse<AuthResponseDto>>(`${environment.apiUrl}/Auth/refresh-token`, { refreshToken })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setSession(response.data);
          }
        }),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    
    try {
      const payload = this.decodeToken(token);
      return payload?.exp ? payload.exp * 1000 < Date.now() : true;
    } catch {
      return true;
    }
  }

  /**
   * Decode JWT token safely
   */
  private decodeToken(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.warn('Invalid JWT token format');
        return null;
      }
      
      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch (error) {
      console.error('Failed to decode JWT token:', error);
      return null;
    }
  }

  /**
   * Extract role from JWT token with support for multiple claim formats
   */
  private extractRoleFromToken(token: string): string | null {
    const payload = this.decodeToken(token);
    if (!payload) return null;

    // Try standard role claim formats
    const possibleRoleClaims = [
      'role',
      'roles',
      'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
    ];

    for (const claim of possibleRoleClaims) {
      const roleValue = payload[claim];
      if (roleValue) {
        // Handle array of roles (take first one)
        if (Array.isArray(roleValue)) {
          return roleValue[0] || null;
        }
        // Handle single role string
        if (typeof roleValue === 'string') {
          return roleValue;
        }
      }
    }

    console.warn('No role found in JWT token claims');
    return null;
  }

  hasRole(role: string): boolean {
    return this.currentUser()?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const userRole = this.currentUser()?.role;
    return userRole ? roles.includes(userRole) : false;
  }

  private setSession(authResult: AuthResponseDto): void {
    try {
      // Store tokens
      localStorage.setItem(this.TOKEN_KEY, authResult.accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, authResult.refreshToken);

      // Extract role from token as fallback
      const tokenRole = this.extractRoleFromToken(authResult.accessToken);
      
      // Use role from response, fallback to token role, then to 'Customer'
      const role = authResult.role || tokenRole || 'Customer';
      
      if (!authResult.role && tokenRole) {
        console.warn('Role not in response, extracted from JWT token:', tokenRole);
      }

      // Create user object
      const user: User = {
        id: authResult.userId,
        email: authResult.email,
        fullName: authResult.fullName,
        role: role
      };

      // Store user data
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      this.currentUser.set(user);
      this.userSubject.next(user);
    } catch (error) {
      console.error('Failed to set session:', error);
      throw new Error('فشل في حفظ بيانات الجلسة');
    }
  }

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }
}
