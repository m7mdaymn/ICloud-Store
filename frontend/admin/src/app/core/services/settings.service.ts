import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of, catchError } from 'rxjs';
import { environment } from '@environments/environment';

// Local simplified ApiResponse (settings-specific)
interface SettingsApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// Matches backend StoreSettingDto
export interface StoreSetting {
  id: number;
  key: string;
  valueAr?: string;
  valueEn?: string;
}

// Matches backend ThemeSettingDto
export interface ThemeSetting {
  id: number;
  activeTheme: string;
  accentColor: string;
  logoLightPath?: string;
  logoDarkPath?: string;
  faviconPath?: string;
}

// Matches backend SocialLinkDto
export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  iconClass?: string;
  isVisible: boolean;
  sortOrder: number;
}

// Combined settings for the admin UI
export interface StoreSettings {
  // Store Info (from key-value settings)
  storeNameAr?: string;
  storeNameEn?: string;
  taglineAr?: string;
  taglineEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  
  // Contact
  email?: string;
  phone?: string;
  whatsAppNumber?: string;
  addressAr?: string;
  addressEn?: string;
  
  // Social Links
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  
  // Theme
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  faviconUrl?: string;
  
  // SEO
  metaTitleAr?: string;
  metaTitleEn?: string;
  metaDescriptionAr?: string;
  metaDescriptionEn?: string;
  metaKeywordsAr?: string;
  metaKeywordsEn?: string;
  
  // Business
  workingHoursAr?: string;
  workingHoursEn?: string;
  currency?: string;
  defaultLanguage?: string;
}

export type UpdateSettingsRequest = Partial<StoreSettings>;

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly apiUrl = `${environment.apiUrl}/Settings`;

  constructor(private http: HttpClient) {}

  // Get combined settings from multiple endpoints
  get(): Observable<SettingsApiResponse<StoreSettings>> {
    return forkJoin({
      storeSettings: this.http.get<SettingsApiResponse<StoreSetting[]>>(`${this.apiUrl}/store`).pipe(
        catchError(() => of({ success: true, data: [] as StoreSetting[] }))
      ),
      theme: this.http.get<SettingsApiResponse<ThemeSetting>>(`${this.apiUrl}/theme`).pipe(
        catchError(() => of({ success: true, data: undefined }))
      ),
      socialLinks: this.http.get<SettingsApiResponse<SocialLink[]>>(`${this.apiUrl}/social-links`).pipe(
        catchError(() => of({ success: true, data: [] as SocialLink[] }))
      )
    }).pipe(
      map(results => {
        const settings: StoreSettings = {};
        
        // Map store settings from key-value pairs
        if (results.storeSettings.data) {
          for (const setting of results.storeSettings.data) {
            switch (setting.key) {
              case 'store_name': 
                settings.storeNameAr = setting.valueAr; 
                settings.storeNameEn = setting.valueEn; 
                break;
              case 'tagline': 
                settings.taglineAr = setting.valueAr; 
                settings.taglineEn = setting.valueEn; 
                break;
              case 'description':
                settings.descriptionAr = setting.valueAr;
                settings.descriptionEn = setting.valueEn;
                break;
              case 'email': settings.email = setting.valueEn || setting.valueAr; break;
              case 'phone': settings.phone = setting.valueEn || setting.valueAr; break;
              case 'whatsapp': settings.whatsAppNumber = setting.valueEn || setting.valueAr; break;
              case 'address':
                settings.addressAr = setting.valueAr;
                settings.addressEn = setting.valueEn;
                break;
              case 'working_hours':
                settings.workingHoursAr = setting.valueAr;
                settings.workingHoursEn = setting.valueEn;
                break;
              case 'currency': settings.currency = setting.valueEn || 'EGP'; break;
              case 'default_language': settings.defaultLanguage = setting.valueEn || 'ar'; break;
              case 'meta_title':
                settings.metaTitleAr = setting.valueAr;
                settings.metaTitleEn = setting.valueEn;
                break;
              case 'meta_description':
                settings.metaDescriptionAr = setting.valueAr;
                settings.metaDescriptionEn = setting.valueEn;
                break;
              case 'meta_keywords':
                settings.metaKeywordsAr = setting.valueAr;
                settings.metaKeywordsEn = setting.valueEn;
                break;
            }
          }
        }
        
        // Map theme settings
        if (results.theme.data) {
          settings.primaryColor = results.theme.data.accentColor || '#25D366';
          settings.logoUrl = results.theme.data.logoLightPath;
          settings.faviconUrl = results.theme.data.faviconPath;
        }
        
        // Map social links
        if (results.socialLinks.data) {
          for (const link of results.socialLinks.data) {
            switch (link.platform.toLowerCase()) {
              case 'facebook': settings.facebookUrl = link.url; break;
              case 'instagram': settings.instagramUrl = link.url; break;
              case 'twitter': settings.twitterUrl = link.url; break;
              case 'youtube': settings.youtubeUrl = link.url; break;
              case 'tiktok': settings.tiktokUrl = link.url; break;
            }
          }
        }
        
        return { success: true, data: settings };
      })
    );
  }

  // Update settings by calling multiple endpoints
  update(settings: UpdateSettingsRequest): Observable<SettingsApiResponse<StoreSettings>> {
    const updates: Observable<any>[] = [];
    
    // Update store settings as key-value pairs
    const storeSettings: { key: string; valueAr?: string; valueEn?: string }[] = [];
    
    if (settings.storeNameAr !== undefined || settings.storeNameEn !== undefined) {
      storeSettings.push({ key: 'store_name', valueAr: settings.storeNameAr, valueEn: settings.storeNameEn });
    }
    if (settings.taglineAr !== undefined || settings.taglineEn !== undefined) {
      storeSettings.push({ key: 'tagline', valueAr: settings.taglineAr, valueEn: settings.taglineEn });
    }
    if (settings.email !== undefined) {
      storeSettings.push({ key: 'email', valueEn: settings.email });
    }
    if (settings.phone !== undefined) {
      storeSettings.push({ key: 'phone', valueEn: settings.phone });
    }
    if (settings.whatsAppNumber !== undefined) {
      storeSettings.push({ key: 'whatsapp', valueEn: settings.whatsAppNumber });
    }
    if (settings.addressAr !== undefined || settings.addressEn !== undefined) {
      storeSettings.push({ key: 'address', valueAr: settings.addressAr, valueEn: settings.addressEn });
    }
    if (settings.workingHoursAr !== undefined || settings.workingHoursEn !== undefined) {
      storeSettings.push({ key: 'working_hours', valueAr: settings.workingHoursAr, valueEn: settings.workingHoursEn });
    }
    if (settings.currency !== undefined) {
      storeSettings.push({ key: 'currency', valueEn: settings.currency });
    }
    if (settings.defaultLanguage !== undefined) {
      storeSettings.push({ key: 'default_language', valueEn: settings.defaultLanguage });
    }
    
    // Add store setting updates
    for (const s of storeSettings) {
      updates.push(
        this.http.put(`${this.apiUrl}/store/${s.key}`, { valueAr: s.valueAr, valueEn: s.valueEn }).pipe(
          catchError(() => of({ success: false }))
        )
      );
    }
    
    // Update theme if color changed
    if (settings.primaryColor !== undefined) {
      updates.push(
        this.http.put(`${this.apiUrl}/theme`, { 
          activeTheme: 'Light', 
          accentColor: settings.primaryColor 
        }).pipe(catchError(() => of({ success: false })))
      );
    }
    
    if (updates.length === 0) {
      return of({ success: true, data: settings as StoreSettings, message: 'لا توجد تغييرات' });
    }
    
    return forkJoin(updates).pipe(
      map(() => ({ success: true, data: settings as StoreSettings, message: 'تم حفظ الإعدادات' }))
    );
  }

  // Get theme settings only
  getTheme(): Observable<SettingsApiResponse<ThemeSetting>> {
    return this.http.get<SettingsApiResponse<ThemeSetting>>(`${this.apiUrl}/theme`);
  }

  // Update theme
  updateTheme(theme: { activeTheme: string; accentColor: string }): Observable<SettingsApiResponse<ThemeSetting>> {
    return this.http.put<SettingsApiResponse<ThemeSetting>>(`${this.apiUrl}/theme`, theme);
  }

  // Get social links
  getSocialLinks(): Observable<SettingsApiResponse<SocialLink[]>> {
    return this.http.get<SettingsApiResponse<SocialLink[]>>(`${this.apiUrl}/social-links`);
  }
}
