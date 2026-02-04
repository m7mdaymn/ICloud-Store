import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { ApiResponse, PagedResult } from './category.service';

export interface Brand {
  id: number;
  nameAr: string;
  nameEn: string;
  slug: string;
  logoUrl?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateBrandRequest {
  nameAr: string;
  nameEn: string;
  logoUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateBrandRequest extends CreateBrandRequest {
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private readonly apiUrl = `${environment.apiUrl}/Brands`;

  constructor(private http: HttpClient) {}

  getAll(page: number = 1, pageSize: number = 10, includeInactive: boolean = true): Observable<ApiResponse<PagedResult<Brand>>> {
    let params = new HttpParams()
      .set('pageNumber', page.toString())
      .set('pageSize', pageSize.toString())
      .set('includeInactive', includeInactive.toString());
    
    return this.http.get<ApiResponse<PagedResult<Brand>>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ApiResponse<Brand>> {
    return this.http.get<ApiResponse<Brand>>(`${this.apiUrl}/${id}`);
  }

  create(brand: CreateBrandRequest): Observable<ApiResponse<Brand>> {
    return this.http.post<ApiResponse<Brand>>(this.apiUrl, brand);
  }

  update(id: number, brand: UpdateBrandRequest): Observable<ApiResponse<Brand>> {
    return this.http.put<ApiResponse<Brand>>(`${this.apiUrl}/${id}`, brand);
  }

  delete(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`);
  }

  reorder(brandIds: number[]): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/reorder`, { brandIds });
  }
}
