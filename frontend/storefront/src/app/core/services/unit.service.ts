import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { API_ENDPOINTS } from '@core/constant/api-endpoint';
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Unit interfaces
export interface Unit {
  id: number;
  productId: number;
  productNameAr: string;
  productNameEn: string;
  brandName: string;
  categoryName: string;
  titleAr: string;
  titleEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  storage?: string;
  color?: string;
  condition: 'New' | 'Used' | 'Refurbished';
  batteryHealth?: number;
  warrantyType: string;
  warrantyRemainingMonths?: number;
  status: 'Available' | 'Reserved' | 'Sold' | 'Hidden';
  isFeatured: boolean;
  isDeleted: boolean;
  primaryImageUrl?: string;
  media?: UnitMedia[];
  paymentInfo?: PaymentInfo;
  createdAt: string;
}

export interface UnitMedia {
  id: number;
  url: string;
  fileName: string;
  isCover: boolean;
  sortOrder: number;
}

export interface PaymentInfo {
  cashPrice: number;
  originalPrice?: number;
  discountPercentage?: number;
  acceptsInstallment: boolean;
  installmentPlans: InstallmentPlan[];
}

export interface InstallmentPlan {
  id: number;
  months: number;
  monthlyAmount: number;
  downPayment?: number;
}

export interface UnitFilter {
  page?: number;
  pageSize?: number;
  productId?: number;
  categoryId?: number;
  brandId?: number;
  status?: string;
  isNew?: boolean;
  condition?: string;
  storage?: string;
  color?: string;
  minBatteryHealth?: number;
  maxBatteryHealth?: number;
  minPrice?: number;
  maxPrice?: number;
  includeDeleted?: boolean;
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

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  private http = inject(HttpClient);

  /**
   * Get unit by ID
   */
  getUnitById(id: number): Observable<Unit | null> {
    return this.http.get<ApiResponse<Unit>>(
      API_ENDPOINTS.units.getById(id)
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        return null;
      }),
      catchError(error => {
        console.error('Error fetching unit:', error);
        return of(null);
      })
    );
  }

  /**
   * Get all units with filters
   */
  getUnits(filter: UnitFilter): Observable<PagedResult<Unit>> {
    let params = new HttpParams();
    
    // Pagination
    if (filter.page) params = params.set('page', filter.page.toString());
    if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
    
    // Filters
    if (filter.productId) params = params.set('productId', filter.productId.toString());
    if (filter.categoryId) params = params.set('categoryId', filter.categoryId.toString());
    if (filter.brandId) params = params.set('brandId', filter.brandId.toString());
    if (filter.status) params = params.set('status', filter.status);
    if (filter.isNew !== undefined) params = params.set('isNew', filter.isNew.toString());
    if (filter.condition) params = params.set('condition', filter.condition);
    if (filter.storage) params = params.set('storage', filter.storage);
    if (filter.color) params = params.set('color', filter.color);
    if (filter.minBatteryHealth) params = params.set('minBatteryHealth', filter.minBatteryHealth.toString());
    if (filter.maxBatteryHealth) params = params.set('maxBatteryHealth', filter.maxBatteryHealth.toString());
    if (filter.minPrice) params = params.set('minPrice', filter.minPrice.toString());
    if (filter.maxPrice) params = params.set('maxPrice', filter.maxPrice.toString());
    if (filter.includeDeleted) params = params.set('includeDeleted', 'true');
    
    // Sorting
    if (filter.sortBy) {
      params = params.set('sortBy', filter.sortBy);
      if (filter.sortDesc !== undefined) {
        params = params.set('sortDesc', filter.sortDesc.toString());
      }
    }

    return this.http.get<ApiResponse<PagedResult<Unit>>>(
      API_ENDPOINTS.units.getAll,
      { params }
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        return this.getEmptyPagedResult(filter.page || 1, filter.pageSize || 12);
      }),
      catchError(error => {
        console.error('Error fetching units:', error);
        return of(this.getEmptyPagedResult(filter.page || 1, filter.pageSize || 12));
      })
    );
  }

  /**
   * Get available units (customer-facing)
   */
  getAvailableUnits(filter: Partial<UnitFilter>): Observable<PagedResult<Unit>> {
    let params = new HttpParams();
    
    if (filter.page) params = params.set('page', filter.page.toString());
    if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
    if (filter.categoryId) params = params.set('categoryId', filter.categoryId.toString());
    if (filter.isNew !== undefined) params = params.set('isNew', filter.isNew.toString());
    if (filter.storage) params = params.set('storage', filter.storage);
    if (filter.color) params = params.set('color', filter.color);
    if (filter.condition) params = params.set('condition', filter.condition);
    if (filter.minBatteryHealth) params = params.set('minBatteryHealth', filter.minBatteryHealth.toString());
    if (filter.maxBatteryHealth) params = params.set('maxBatteryHealth', filter.maxBatteryHealth.toString());
    if (filter.minPrice) params = params.set('minPrice', filter.minPrice.toString());
    if (filter.maxPrice) params = params.set('maxPrice', filter.maxPrice.toString());

    return this.http.get<ApiResponse<PagedResult<Unit>>>(
      API_ENDPOINTS.units.getAvailable,
      { params }
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        return this.getEmptyPagedResult(filter.page || 1, filter.pageSize || 12);
      }),
      catchError(error => {
        console.error('Error fetching available units:', error);
        return of(this.getEmptyPagedResult(filter.page || 1, filter.pageSize || 12));
      })
    );
  }

  /**
   * Get new arrivals
   */
  getNewArrivals(count: number = 8): Observable<Unit[]> {
    const params = new HttpParams().set('count', count.toString());
    
    return this.http.get<ApiResponse<Unit[]>>(
      API_ENDPOINTS.units.getNewArrivals,
      { params }
    ).pipe(
      map(response => response.success && response.data ? response.data : []),
      catchError(error => {
        console.error('Error fetching new arrivals:', error);
        return of([]);
      })
    );
  }

  /**
   * Get latest units (alias for new arrivals)
   */
  getLatestUnits(count: number = 8): Observable<Unit[]> {
    return this.getNewArrivals(count);
  }

  /**
   * Get featured units
   */
  getFeaturedUnits(ids: number[]): Observable<Unit[]> {
    if (!ids || ids.length === 0) {
      // If no IDs provided, return new arrivals as featured
      return this.getNewArrivals(8);
    }

    const params = new HttpParams().set('ids', ids.join(','));
    
    return this.http.get<ApiResponse<Unit[]>>(
      API_ENDPOINTS.units.getFeatured,
      { params }
    ).pipe(
      map(response => response.success && response.data ? response.data : []),
      catchError(error => {
        console.error('Error fetching featured units:', error);
        return of([]);
      })
    );
  }

  /**
   * Get units by category
   */
  getUnitsByCategory(categoryId: number, page: number = 1, pageSize: number = 12): Observable<PagedResult<Unit>> {
    return this.getAvailableUnits({
      categoryId,
      page,
      pageSize
    });
  }

  /**
   * Search units
   */
  searchUnits(query: string, page: number = 1, pageSize: number = 20): Observable<PagedResult<Unit>> {
    // Assuming your backend supports search via query parameter
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('search', query);

    return this.http.get<ApiResponse<PagedResult<Unit>>>(
      API_ENDPOINTS.units.getAvailable,
      { params }
    ).pipe(
      map(response => response.success && response.data ? response.data : this.getEmptyPagedResult(page, pageSize)),
      catchError(() => of(this.getEmptyPagedResult(page, pageSize)))
    );
  }

  /**
   * Get unit media
   */
  getUnitMedia(id: number): Observable<UnitMedia[]> {
    return this.http.get<ApiResponse<UnitMedia[]>>(
      API_ENDPOINTS.units.media.getAll(id)
    ).pipe(
      map(response => response.success && response.data ? response.data : []),
      catchError(() => of([]))
    );
  }

  /**
   * Get unit payment info
   */
  getUnitPaymentInfo(id: number): Observable<PaymentInfo | null> {
    return this.http.get<ApiResponse<PaymentInfo>>(
      API_ENDPOINTS.units.paymentInfo.get(id)
    ).pipe(
      map(response => response.success ? response.data : null),
      catchError(() => of(null))
    );
  }

  /**
   * Helper method to return empty paged result
   */
  private getEmptyPagedResult(page: number, pageSize: number): PagedResult<Unit> {
    return {
      items: [],
      totalCount: 0,
      page,
      pageSize,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false
    };
  }
}