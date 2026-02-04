import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { ApiResponse, PagedResult } from './category.service';

export interface Lead {
  id: number;
  
  // Customer Info
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerId?: string;
  
  // Item Info
  targetType: string;
  targetId: number;
  targetTitle?: string;
  targetImage?: string;
  targetPrice?: number;
  
  // Lead Details
  source: LeadSource;
  message?: string;
  whatsAppUrl?: string;
  
  // Timestamps
  createdAt: string;
  
  // Session Info
  sessionId?: string;
  userAgent?: string;
  ipAddress?: string;
}

export enum LeadSource {
  WhatsAppClick = 0,
  InquiryForm = 1,
  CallRequest = 2,
  Other = 3
}

export interface LeadFilterParams {
  targetType?: string;
  source?: LeadSource;
  startDate?: string;
  endDate?: string;
  search?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDesc?: boolean;
}

export interface LeadStats {
  todayCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private readonly apiUrl = `${environment.apiUrl}/Leads`;

  constructor(private http: HttpClient) {}

  getAll(filters?: LeadFilterParams): Observable<ApiResponse<PagedResult<Lead>>> {
    let params = new HttpParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }
    
    return this.http.get<ApiResponse<PagedResult<Lead>>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<ApiResponse<Lead>> {
    return this.http.get<ApiResponse<Lead>>(`${this.apiUrl}/${id}`);
  }

  getTodayCount(): Observable<ApiResponse<LeadStats>> {
    return this.http.get<ApiResponse<LeadStats>>(`${this.apiUrl}/stats/today`);
  }

  exportToExcel(filters?: LeadFilterParams): Observable<Blob> {
    let params = new HttpParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }
    
    return this.http.get(`${this.apiUrl}/export`, { 
      params,
      responseType: 'blob'
    });
  }
}
