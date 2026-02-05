import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { API_ENDPOINTS } from '@core/constant/api-endpoint';
// API Response wrapper
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Product interfaces
export interface Product {
  id: number;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  slug: string;
  brandId?: number;
  brandName?: string;
  categoryId?: number;
  categoryName?: string;
  isFeatured: boolean;
  isActive: boolean;
  primaryImageUrl?: string;
  media?: ProductMedia[];
  attributes?: ProductAttribute[];
  stock?: ProductStock;
  paymentInfo?: PaymentInfo;
}

export interface ProductMedia {
  id: number;
  url: string;
  fileName: string;
  isCover: boolean;
  sortOrder: number;
}

export interface ProductAttribute {
  id: number;
  nameAr: string;
  nameEn: string;
  valueAr: string;
  valueEn: string;
  sortOrder: number;
}

export interface ProductStock {
  isInStock: boolean;
  quantity?: number;
  lowStockThreshold?: number;
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

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductFilter {
  page?: number;
  pageSize?: number;
  categoryId?: number;
  brandId?: number;
  inventoryMode?: string;
  includeInactive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);

  /**
   * Get product by ID
   */
  getProductById(id: number): Observable<Product | null> {
    return this.http.get<ApiResponse<Product>>(
      API_ENDPOINTS.products.getById(id)
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        return null;
      }),
      catchError(error => {
        console.error('Error fetching product:', error);
        return of(null);
      })
    );
  }

  /**
   * Get product by slug
   */
  getProductBySlug(slug: string, lang: string = 'en'): Observable<Product | null> {
    const params = new HttpParams().set('lang', lang);
    
    return this.http.get<ApiResponse<Product>>(
      API_ENDPOINTS.products.getBySlug(slug),
      { params }
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        return null;
      }),
      catchError(error => {
        console.error('Error fetching product by slug:', error);
        return of(null);
      })
    );
  }

  /**
   * Get all products with filters
   */
  getProducts(filters: ProductFilter): Observable<PagedResult<Product>> {
    let params = new HttpParams();
    
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.pageSize) params = params.set('pageSize', filters.pageSize.toString());
    if (filters.categoryId) params = params.set('categoryId', filters.categoryId.toString());
    if (filters.brandId) params = params.set('brandId', filters.brandId.toString());
    if (filters.inventoryMode) params = params.set('inventoryMode', filters.inventoryMode);
    if (filters.includeInactive) params = params.set('includeInactive', 'true');

    return this.http.get<ApiResponse<PagedResult<Product>>>(
      API_ENDPOINTS.products.getAll,
      { params }
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        return this.getEmptyPagedResult(filters.page || 1, filters.pageSize || 12);
      }),
      catchError(error => {
        console.error('Error fetching products:', error);
        return of(this.getEmptyPagedResult(filters.page || 1, filters.pageSize || 12));
      })
    );
  }

  /**
   * Search products
   */
  searchProducts(query: string, page: number = 1, pageSize: number = 20): Observable<PagedResult<Product>> {
    // Assuming your backend supports search via query parameter
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('search', query);

    return this.http.get<ApiResponse<PagedResult<Product>>>(
      API_ENDPOINTS.products.getAll,
      { params }
    ).pipe(
      map(response => response.success && response.data ? response.data : this.getEmptyPagedResult(page, pageSize)),
      catchError(() => of(this.getEmptyPagedResult(page, pageSize)))
    );
  }

  /**
   * Get featured products
   */
  getFeaturedProducts(limit: number = 4): Observable<Product[]> {
    const params = new HttpParams()
      .set('page', '1')
      .set('pageSize', limit.toString());

    return this.http.get<ApiResponse<PagedResult<Product>>>(
      API_ENDPOINTS.products.getAll,
      { params }
    ).pipe(
      map(response => {
        if (response.success && response.data) {
          // Filter featured or return first items
          const featured = response.data.items.filter(p => p.isFeatured);
          return featured.length > 0 ? featured.slice(0, limit) : response.data.items.slice(0, limit);
        }
        return [];
      }),
      catchError(() => of([]))
    );
  }

  /**
   * Get product stock
   */
  getProductStock(id: number): Observable<ProductStock | null> {
    return this.http.get<ApiResponse<ProductStock>>(
      API_ENDPOINTS.products.stock.get(id)
    ).pipe(
      map(response => response.success ? response.data : null),
      catchError(() => of(null))
    );
  }

  /**
   * Get product attributes
   */
  getProductAttributes(id: number): Observable<ProductAttribute[]> {
    return this.http.get<ApiResponse<ProductAttribute[]>>(
      API_ENDPOINTS.products.attributes.getAll(id)
    ).pipe(
      map(response => response.success && response.data ? response.data : []),
      catchError(() => of([]))
    );
  }

  /**
   * Get product payment info
   */
  getProductPaymentInfo(id: number): Observable<PaymentInfo | null> {
    return this.http.get<ApiResponse<PaymentInfo>>(
      API_ENDPOINTS.products.paymentInfo.get(id)
    ).pipe(
      map(response => response.success ? response.data : null),
      catchError(() => of(null))
    );
  }

  /**
   * Helper method to return empty paged result
   */
  private getEmptyPagedResult(page: number, pageSize: number): PagedResult<Product> {
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