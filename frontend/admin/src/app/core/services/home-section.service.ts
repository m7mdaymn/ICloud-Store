import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { ApiResponse, PagedResult } from './category.service';

export interface HomeSection {
  id: number;
  titleAr: string;
  titleEn: string;
  subtitleAr?: string;
  subtitleEn?: string;
  sectionType: HomeSectionType;
  targetType: TargetType;
  targetId?: number;
  targetUrl?: string;
  imageUrl?: string;
  backgroundColor?: string;
  sortOrder: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  items?: HomeSectionItem[];
  createdAt: string;
  updatedAt?: string;
}

export interface HomeSectionItem {
  id: number;
  homeSectionId: number;
  targetType: TargetType;
  targetId: number;
  sortOrder: number;
  targetTitle?: string;
  targetImage?: string;
}

export enum HomeSectionType {
  Banner = 0,
  FeaturedUnits = 1,
  CategoryShowcase = 2,
  BrandShowcase = 3,
  NewArrivals = 4,
  Accessories = 5,
  Custom = 6
}

export enum TargetType {
  None = 0,
  Category = 1,
  Brand = 2,
  Unit = 3,
  Product = 4,
  ExternalUrl = 5
}

export interface CreateHomeSectionRequest {
  titleAr: string;
  titleEn: string;
  subtitleAr?: string;
  subtitleEn?: string;
  sectionType: HomeSectionType;
  targetType?: TargetType;
  targetId?: number;
  targetUrl?: string;
  imageUrl?: string;
  backgroundColor?: string;
  sortOrder?: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  itemIds?: number[];
}

export interface UpdateHomeSectionRequest extends CreateHomeSectionRequest {
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class HomeSectionService {
  private readonly apiUrl = `${environment.apiUrl}/HomeSections`;

  constructor(private http: HttpClient) {}

  getAll(includeInactive: boolean = true): Observable<ApiResponse<HomeSection[]>> {
    let params = new HttpParams().set('includeInactive', includeInactive.toString());
    return this.http.get<ApiResponse<HomeSection[]>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ApiResponse<HomeSection>> {
    return this.http.get<ApiResponse<HomeSection>>(`${this.apiUrl}/${id}`);
  }

  create(section: CreateHomeSectionRequest): Observable<ApiResponse<HomeSection>> {
    return this.http.post<ApiResponse<HomeSection>>(this.apiUrl, section);
  }

  update(id: number, section: UpdateHomeSectionRequest): Observable<ApiResponse<HomeSection>> {
    return this.http.put<ApiResponse<HomeSection>>(`${this.apiUrl}/${id}`, section);
  }

  delete(id: number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}/${id}`);
  }

  reorder(sectionIds: number[]): Observable<ApiResponse<boolean>> {
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/reorder`, { sectionIds });
  }

  updateItems(sectionId: number, itemIds: number[]): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(`${this.apiUrl}/${sectionId}/items`, { itemIds });
  }
}
