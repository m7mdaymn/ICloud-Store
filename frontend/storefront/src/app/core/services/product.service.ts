import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '@env/environment';

export interface ProductMedia {
  id: number;
  url: string;
  type: 'Image' | 'Video';
  isPrimary: boolean;
  displayOrder: number;
}

export interface ProductAttribute {
  id: number;
  nameAr: string;
  nameEn: string;
  valueAr: string;
  valueEn: string;
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

export interface ProductPaymentInfo {
  id: number;
  cashPrice: number;
  originalPrice?: number;
  discountPercentage?: number;
  acceptsInstallment: boolean;
  installmentPlans: InstallmentPlan[];
}

export interface ProductStock {
  id: number;
  sku: string;
  quantity: number;
  lowStockThreshold: number;
  isInStock: boolean;
}

export interface Product {
  id: number;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  slug: string;
  
  // Classification
  categoryIds: number[];
  brandId: number;
  categoryNames?: string[];
  brandName?: string;
  
  // Stock
  stock?: ProductStock;
  
  // Media
  primaryImageUrl?: string;
  media: ProductMedia[];
  
  // Attributes
  attributes: ProductAttribute[];
  
  // Payment
  paymentInfo?: ProductPaymentInfo;
  
  // Meta
  isActive: boolean;
  isFeatured: boolean;
  viewCount: number;
  createdAt: string;
}

export interface ProductFilter {
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isFeatured?: boolean;
  inStock?: boolean;
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
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/Products`;

  getProducts(filter?: ProductFilter): Observable<PagedResult<Product>> {
    let params = new HttpParams();
    
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }

    return this.http.get<ApiResponse<PagedResult<Product>>>(this.apiUrl, { params }).pipe(
      map(response => response.data || { items: [], totalCount: 0, page: 1, pageSize: 12, totalPages: 0, hasNextPage: false, hasPreviousPage: false })
    );
  }

  getProductById(id: number): Observable<Product | null> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${id}`).pipe(
      map(response => response.data || null)
    );
  }

  getFeaturedProducts(limit: number = 8): Observable<Product[]> {
    return this.getProducts({ isFeatured: true, pageSize: limit }).pipe(
      map(result => result.items)
    );
  }

  getAccessories(page: number = 1, pageSize: number = 12): Observable<PagedResult<Product>> {
    // Accessories category ID - this would typically come from the backend
    return this.getProducts({ page, pageSize });
  }

  searchProducts(query: string, page: number = 1, pageSize: number = 12): Observable<PagedResult<Product>> {
    return this.getProducts({ search: query, page, pageSize });
  }
}
