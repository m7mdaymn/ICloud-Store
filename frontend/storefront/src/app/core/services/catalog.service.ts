import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@env/environment';

export interface Category {
  id: number;
  nameAr: string;
  nameEn: string;
  slug: string;
  descriptionAr?: string;
  descriptionEn?: string;
  imageUrl?: string;
  parentId?: number;
  isActive: boolean;
  displayOrder: number;
  children?: Category[];
}

export interface Brand {
  id: number;
  nameAr: string;
  nameEn: string;
  slug: string;
  logoUrl?: string;
  isActive: boolean;
  displayOrder: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Categories
  getCategories(): Observable<Category[]> {
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/Categories`).pipe(
      map(response => response.data || [])
    );
  }

  getRootCategories(): Observable<Category[]> {
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/Categories/root`).pipe(
      map(response => response.data || [])
    );
  }

  getCategoryBySlug(slug: string): Observable<Category | null> {
    return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/Categories/slug/${slug}`).pipe(
      map(response => response.data || null)
    );
  }

  // getCategoryById(id: number): Observable<Category | null> {
  //   return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/Categories/${id}`).pipe(
  //     map(response => response.data || null)ٍٍ
  //   );
  // }

  // Brands
  getBrands(): Observable<Brand[]> {
    return this.http.get<ApiResponse<Brand[]>>(`${this.apiUrl}/Brands`).pipe(
      map(response => response.data || [])
    );
  }

  getBrandBySlug(slug: string): Observable<Brand | null> {
    return this.http.get<ApiResponse<Brand>>(`${this.apiUrl}/Brands/slug/${slug}`).pipe(
      map(response => response.data || null)
    );
  }
}
