import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { ApiResponse, PagedResult } from './category.service';

export interface Unit {
  id: number;
  sku: string;
  titleAr: string;
  titleEn: string;
  slug: string;
  descriptionAr?: string;
  descriptionEn?: string;
  condition: UnitCondition;
  status: UnitStatus;
  
  // Pricing
  price: number;
  originalPrice?: number;
  currency: string;
  
  // Specifications
  color?: string;
  colorHex?: string;
  storageCapacity?: string;
  batteryHealth?: number;
  
  // Payment Options
  cashPrice?: number;
  installmentPrice?: number;
  installmentMonths?: number;
  monthlyInstallment?: number;
  downPayment?: number;
  
  // Warranty
  warrantyType: WarrantyType;
  warrantyMonths?: number;
  warrantyDescriptionAr?: string;
  warrantyDescriptionEn?: string;
  
  // Relations
  categoryId: number;
  categoryName?: string;
  brandId: number;
  brandName?: string;
  
  // Media
  thumbnailUrl?: string;
  images: UnitImage[];
  
  // Stats
  viewCount: number;
  
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UnitImage {
  id: number;
  imageUrl: string;
  sortOrder: number;
  isMain: boolean;
}

export enum UnitCondition {
  New = 0,
  UsedExcellent = 1,
  UsedVeryGood = 2,
  UsedGood = 3,
  UsedFair = 4
}

export enum UnitStatus {
  Available = 0,
  Reserved = 1,
  Sold = 2,
  Hidden = 3
}

export enum WarrantyType {
  None = 0,
  Store = 1,
  Manufacturer = 2,
  Extended = 3
}

export interface CreateUnitRequest {
  sku?: string;
  titleAr: string;
  titleEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  condition: UnitCondition;
  status?: UnitStatus;
  price: number;
  originalPrice?: number;
  currency?: string;
  color?: string;
  colorHex?: string;
  storageCapacity?: string;
  batteryHealth?: number;
  cashPrice?: number;
  installmentPrice?: number;
  installmentMonths?: number;
  monthlyInstallment?: number;
  downPayment?: number;
  warrantyType?: WarrantyType;
  warrantyMonths?: number;
  warrantyDescriptionAr?: string;
  warrantyDescriptionEn?: string;
  categoryId: number;
  brandId: number;
  thumbnailUrl?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  images?: { imageUrl: string; sortOrder: number; isMain: boolean; }[];
}

export interface UpdateUnitRequest extends CreateUnitRequest {
  id: number;
}

export interface UnitFilterParams {
  categoryId?: number;
  brandId?: number;
  condition?: UnitCondition;
  status?: UnitStatus;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDesc?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UnitService {
  private readonly apiUrl = `${environment.apiUrl}/Units`;

  constructor(private http: HttpClient) {}

  getAll(filters?: UnitFilterParams): Observable<ApiResponse<PagedResult<Unit>>> {
    let params = new HttpParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }
    
    return this.http.get<ApiResponse<PagedResult<Unit>>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ApiResponse<Unit>> {
    return this.http.get<ApiResponse<Unit>>(`${this.apiUrl}/${id}`);
  }

  create(unit: CreateUnitRequest): Observable<ApiResponse<Unit>> {
    return this.http.post<ApiResponse<Unit>>(this.apiUrl, unit);
  }

  update(id: number, unit: UpdateUnitRequest): Observable<ApiResponse<Unit>> {
    return this.http.put<ApiResponse<Unit>>(`${this.apiUrl}/${id}`, unit);
  }

  delete(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`);
  }

  updateStatus(id: number, status: UnitStatus): Observable<ApiResponse<boolean>> {
    return this.http.patch<ApiResponse<boolean>>(`${this.apiUrl}/${id}/status`, { status });
  }
}
