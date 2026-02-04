import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { ApiResponse, PagedResult } from './category.service';

export interface Product {
  id: number;
  sku: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  descriptionAr?: string;
  descriptionEn?: string;
  
  // Pricing
  price: number;
  originalPrice?: number;
  currency: string;
  
  // Stock
  stockQuantity: number;
  lowStockThreshold: number;
  isInStock: boolean;
  
  // Relations
  categoryId: number;
  categoryName?: string;
  brandId?: number;
  brandName?: string;
  
  // Media
  thumbnailUrl?: string;
  images: ProductImage[];
  
  // Attributes
  attributes: ProductAttribute[];
  
  // Stats
  viewCount: number;
  
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  sortOrder: number;
  isMain: boolean;
}

export interface ProductAttribute {
  id: number;
  nameAr: string;
  nameEn: string;
  valueAr: string;
  valueEn: string;
}

export interface CreateProductRequest {
  sku?: string;
  nameAr: string;
  nameEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  stockQuantity: number;
  lowStockThreshold?: number;
  categoryId: number;
  brandId?: number;
  thumbnailUrl?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  images?: { imageUrl: string; sortOrder: number; isMain: boolean; }[];
  attributes?: { nameAr: string; nameEn: string; valueAr: string; valueEn: string; }[];
}

export interface UpdateProductRequest extends CreateProductRequest {
  id: number;
}

export interface ProductFilterParams {
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  inStock?: boolean;
  lowStock?: boolean;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDesc?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/Products`;

  constructor(private http: HttpClient) {}

  getAll(filters?: ProductFilterParams): Observable<ApiResponse<PagedResult<Product>>> {
    let params = new HttpParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }
    
    return this.http.get<ApiResponse<PagedResult<Product>>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${id}`);
  }

  create(product: CreateProductRequest): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(this.apiUrl, product);
  }

  update(id: number, product: UpdateProductRequest): Observable<ApiResponse<Product>> {
    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/${id}`, product);
  }

  delete(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`);
  }

  updateStock(id: number, quantity: number): Observable<ApiResponse<boolean>> {
    return this.http.patch<ApiResponse<boolean>>(`${this.apiUrl}/${id}/stock`, { quantity });
  }
}
