import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@env/environment';

export interface UnitMedia {
  id: number;
  url: string;
  type: 'Image' | 'Video';
  isPrimary: boolean;
  displayOrder: number;
}

export interface InstallmentPlan {
  id: number;
  months: number;
  monthlyAmount: number;
  downPayment: number;
  totalAmount: number;
  adminFees?: number;
  provider?: string;
}

export interface PaymentInfo {
  id: number;
  cashPrice: number;
  originalPrice?: number;
  discountPercentage?: number;
  acceptsInstallment: boolean;
  installmentPlans: InstallmentPlan[];
}

export interface Unit {
  id: number;
  titleAr: string;
  titleEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  slug: string;
  
  // Specs
  color?: string;
  storage?: string;
  batteryHealth?: number;
  
  // Classification
  condition: 'New' | 'Used' | 'Refurbished';
  status: 'Available' | 'Reserved' | 'Sold' | 'Hidden';
  
  // Warranty
  warrantyType: 'None' | 'Store' | 'Official';
  warrantyMonths?: number;
  warrantyExpiryDate?: string;
  warrantyRemainingMonths?: number;
  
  // Relations
  categoryId: number;
  brandId: number;
  categoryName?: string;
  brandName?: string;
  
  // Media
  primaryImageUrl?: string;
  media: UnitMedia[];
  
  // Payment
  paymentInfo?: PaymentInfo;
  
  // Meta
  viewCount: number;
  isFeatured: boolean;
  createdAt: string;
}

export interface UnitFilter {
  categoryId?: number;
  brandId?: number;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  storage?: string;
  color?: string;
  search?: string;
  isFeatured?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDesc?: boolean;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Units`;

  getUnits(filter?: UnitFilter): Observable<PagedResult<Unit>> {
    let params = new HttpParams();
    
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<PagedResult<Unit>>>(this.apiUrl, { params }).pipe(
      map(response => response.data || { items: [], totalCount: 0, page: 1, pageSize: 12, totalPages: 0, hasNextPage: false, hasPreviousPage: false })
    );
  }

  getUnitById(id: number): Observable<Unit | null> {
    return this.http.get<ApiResponse<Unit>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data || null)
    );
  }

  getFeaturedUnits(limit: number = 8): Observable<Unit[]> {
    return this.getUnits({ isFeatured: true, pageSize: limit }).pipe(
      map(result => result.items)
    );
  }

  getLatestUnits(limit: number = 8): Observable<Unit[]> {
    return this.getUnits({ pageSize: limit, sortBy: 'createdAt', sortDesc: true }).pipe(
      map(result => result.items)
    );
  }

  getUnitsByCategory(categoryId: number, page: number = 1, pageSize: number = 12): Observable<PagedResult<Unit>> {
    return this.getUnits({ categoryId, page, pageSize });
  }

  getUnitsByBrand(brandId: number, page: number = 1, pageSize: number = 12): Observable<PagedResult<Unit>> {
    return this.getUnits({ brandId, page, pageSize });
  }

  searchUnits(query: string, page: number = 1, pageSize: number = 12): Observable<PagedResult<Unit>> {
    return this.getUnits({ search: query, page, pageSize });
  }
}
