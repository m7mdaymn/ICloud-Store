import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { ApiResponse } from './category.service';

export interface UploadResponse {
  url: string;
  fileName: string;
  fileSize: number;
  contentType: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private readonly apiUrl = `${environment.apiUrl}/Files`;

  constructor(private http: HttpClient) {}

  upload(file: File, folder: string = 'general'): Observable<ApiResponse<UploadResponse>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    
    return this.http.post<ApiResponse<UploadResponse>>(`${this.apiUrl}/upload`, formData);
  }

  uploadMultiple(files: File[], folder: string = 'general'): Observable<ApiResponse<UploadResponse[]>> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('folder', folder);
    
    return this.http.post<ApiResponse<UploadResponse[]>>(`${this.apiUrl}/upload-multiple`, formData);
  }

  delete(fileUrl: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.apiUrl}`, { 
      body: { fileUrl } 
    });
  }
}
